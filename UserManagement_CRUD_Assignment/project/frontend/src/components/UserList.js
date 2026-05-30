import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { deleteUser } from '../services/api';
import './UserList.css';

const BASE = 'http://localhost:5000';

const UserList = ({ users, onEdit, onRefresh }) => {
  const [delTarget, setDelTarget] = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(delTarget.id);
      setDelTarget(null);
      onRefresh();
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (users.length === 0) {
    return (
      <div className="ul-card card">
        <div className="ul-header">
          <h2>👥 User List</h2>
          <span className="ul-count-badge">0 records</span>
        </div>
        <div className="ul-empty">
          <div className="ul-empty-icon">📋</div>
          <p>No users found. Add a new user using the form above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ul-card card">
      <div className="ul-header">
        <h2>👥 User List</h2>
        <span className="ul-count-badge">{users.length} record{users.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="ul-table-wrap">
        <table className="ul-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Date of Birth</th>
              <th>City</th>
              <th>Professional Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id}>
                <td className="ul-td-num">{idx + 1}</td>

                {/* Photo */}
                <td>
                  {u.photoPath ? (
                    <img
                      src={`${BASE}${u.photoPath}`}
                      alt={u.firstName}
                      className="ul-avatar"
                    />
                  ) : (
                    <div className="ul-avatar-ph">
                      {u.firstName[0]}{u.lastName[0]}
                    </div>
                  )}
                </td>

                {/* Name */}
                <td className="ul-td-name">
                  {u.firstName} {u.lastName}
                </td>

                {/* Gender */}
                <td>
                  <span className={`ul-gender ul-gender-${u.gender?.toLowerCase()}`}>
                    {u.gender}
                  </span>
                </td>

                {/* Email */}
                <td className="ul-td-email">{u.email}</td>

                {/* Mobile */}
                <td>{u.mobileNo}</td>

                {/* DOB */}
                <td>
                  {u.dateOfBirth
                    ? new Date(u.dateOfBirth).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })
                    : '—'}
                </td>

                {/* City */}
                <td>{u.city}</td>

                {/* Skills */}
                <td>
                  <div className="ul-skills">
                    {(u.professionalSkills || '')
                      .split(',')
                      .filter(Boolean)
                      .map(s => (
                        <span key={s} className="ul-skill-chip">{s}</span>
                      ))}
                  </div>
                </td>

                {/* Actions */}
                <td>
                  <div className="ul-actions">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => onEdit(u)}
                      title="Edit this user"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDelTarget(u)}
                      title="Delete this user"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {delTarget && (
        <ConfirmDialog
          message={`Permanently delete "${delTarget.firstName} ${delTarget.lastName}"? This cannot be undone.`}
          confirmLabel={deleting ? '⏳ Deleting…' : 'Yes, Delete'}
          confirmClass="btn-danger"
          onConfirm={handleDelete}
          onCancel={() => setDelTarget(null)}
        />
      )}
    </div>
  );
};

export default UserList;
