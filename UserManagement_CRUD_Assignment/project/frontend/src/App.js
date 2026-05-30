import React, { useState, useEffect, useCallback } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import { getAllUsers } from './services/api';
import './App.css';

function App() {
  const [users,        setUsers]        = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [apiError,     setApiError]     = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setApiError(
        'Cannot connect to the backend API. ' +
        'Make sure the .NET server is running on http://localhost:5000'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      {/* ── Header ────────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <span className="app-logo-icon">👤</span>
            <div>
              <div className="app-logo-title">User Management System</div>
              <div className="app-logo-sub">CRUD Assignment — Web Development</div>
            </div>
          </div>
          <div className="app-header-right">
            <div className="app-tech-badges">
              <span className="tech-badge">⚛️ React 18</span>
              <span className="tech-badge">🔷 .NET 8</span>
              <span className="tech-badge">🗄️ SQL Server</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────── */}
      <main className="app-main">

        {/* Connection error */}
        {apiError && (
          <div className="alert alert-error app-alert">
            ⚠️ {apiError}
          </div>
        )}

        {/* Form */}
        <UserForm
          selectedUser={selectedUser}
          onSaved={fetchUsers}
          onReset={() => setSelectedUser(null)}
        />

        {/* List */}
        {loading ? (
          <div className="spinner-wrap card" style={{ borderRadius: 16 }}>
            <div className="spinner" />
            <span>Loading users from database…</span>
          </div>
        ) : (
          <UserList
            users={users}
            onEdit={handleEditUser}
            onRefresh={fetchUsers}
          />
        )}

      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="app-footer">
        User Management System &nbsp;|&nbsp; React + .NET 8 + Entity Framework Core + SQL Server
      </footer>
    </div>
  );
}

export default App;
