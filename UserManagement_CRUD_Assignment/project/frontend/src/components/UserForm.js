import React, { useState, useEffect, useRef } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { createUser, updateUser } from '../services/api';
import './UserForm.css';

/* ── Constants ────────────────────────────────────────────────────── */
const CITIES = [
  'Ahmedabad','Bangalore','Chennai','Delhi','Hyderabad',
  'Jaipur','Kolkata','Mumbai','Nagpur','Pune','Surat','Vadodara',
];
const SKILLS = ['Communication','Critical Thinking','Problem Solving','Initiative'];

const EMPTY = {
  firstName:'', lastName:'', gender:'', email:'',
  mobileNo:'', dateOfBirth:'', city:'',
  professionalSkills:[], photo: null,
};

/* ── Component ────────────────────────────────────────────────────── */
const UserForm = ({ selectedUser, onSaved, onReset }) => {
  const [form,       setForm]       = useState(EMPTY);
  const [errors,     setErrors]     = useState({});
  const [preview,    setPreview]    = useState(null);
  const [dialog,     setDialog]     = useState(null);   // 'save' | 'update'
  const [toast,      setToast]      = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  /* populate form when a user is selected for editing */
  useEffect(() => {
    if (selectedUser) {
      setForm({
        firstName:          selectedUser.firstName,
        lastName:           selectedUser.lastName,
        gender:             selectedUser.gender,
        email:              selectedUser.email,
        mobileNo:           selectedUser.mobileNo,
        dateOfBirth:        selectedUser.dateOfBirth?.split('T')[0] ?? '',
        city:               selectedUser.city,
        professionalSkills: selectedUser.professionalSkills
                              ? selectedUser.professionalSkills.split(',').filter(Boolean)
                              : [],
        photo: null,
      });
      setPreview(
        selectedUser.photoPath
          ? `http://localhost:5000${selectedUser.photoPath}`
          : null
      );
      setErrors({});
    }
  }, [selectedUser]);

  /* ── Handlers ─────────────────────────────────────────────────── */
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  const onSkillToggle = (skill) => {
    setForm(p => {
      const list = p.professionalSkills.includes(skill)
        ? p.professionalSkills.filter(s => s !== skill)
        : [...p.professionalSkills, skill];
      return { ...p, professionalSkills: list };
    });
    setErrors(p => ({ ...p, professionalSkills: '' }));
  };

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors(p => ({ ...p, photo: 'Please select a valid image file' }));
      return;
    }
    setForm(p => ({ ...p, photo: file }));
    setPreview(URL.createObjectURL(file));
    setErrors(p => ({ ...p, photo: '' }));
  };

  /* ── Validation ───────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.firstName.trim())                     e.firstName = 'First Name is required';
    if (!form.lastName.trim())                      e.lastName  = 'Last Name is required';
    if (!form.gender)                               e.gender    = 'Gender is required';
    if (!form.email.trim())                         e.email     = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                                    e.email     = 'Enter a valid email address';
    if (!form.mobileNo.trim())                      e.mobileNo  = 'Mobile No is required';
    else if (!/^\d{10}$/.test(form.mobileNo))       e.mobileNo  = 'Must be exactly 10 digits';
    if (!form.dateOfBirth)                          e.dateOfBirth = 'Date of Birth is required';
    if (!form.city)                                 e.city      = 'City is required';
    if (form.professionalSkills.length === 0)       e.professionalSkills = 'Select at least one skill';
    if (!selectedUser && !form.photo)               e.photo     = 'Photo is required';
    return e;
  };

  /* ── Save button click → validate → show confirm dialog ──────── */
  const handleSaveClick = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setDialog(selectedUser ? 'update' : 'save');
  };

  /* ── After user confirms dialog ───────────────────────────────── */
  const handleConfirmed = async () => {
    setDialog(null);
    setSubmitting(true);

    const fd = new FormData();
    fd.append('firstName',  form.firstName.trim());
    fd.append('lastName',   form.lastName.trim());
    fd.append('gender',     form.gender);
    fd.append('email',      form.email.trim().toLowerCase());
    fd.append('mobileNo',   form.mobileNo.trim());
    fd.append('dateOfBirth',form.dateOfBirth);
    fd.append('city',       form.city);
    form.professionalSkills.forEach(s => fd.append('professionalSkills', s));
    if (form.photo) fd.append('photo', form.photo);

    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, fd);
        showToast('success', '✅ User updated successfully!');
      } else {
        await createUser(fd);
        showToast('success', '✅ User saved successfully!');
      }
      handleReset();
      onSaved();
    } catch (err) {
      showToast('error', '❌ ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Reset ────────────────────────────────────────────────────── */
  const handleReset = () => {
    setForm(EMPTY);
    setPreview(null);
    setErrors({});
    if (fileRef.current) fileRef.current.value = '';
    onReset();
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const isEdit = Boolean(selectedUser);

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <div className="uf-card card">
      {/* Header */}
      <div className="uf-header">
        <h2>{isEdit ? '✏️ Update User' : '➕ Add New User'}</h2>
        {isEdit && (
          <span className="uf-editing-badge">
            Editing: {selectedUser.firstName} {selectedUser.lastName}
          </span>
        )}
      </div>

      <div className="uf-body">
        {/* Toast */}
        {toast && (
          <div className={`alert alert-${toast.type === 'success' ? 'success' : 'error'} uf-toast`}>
            {toast.msg}
          </div>
        )}

        {/* ── Grid ── */}
        <div className="uf-grid">

          {/* First Name */}
          <div className="uf-field">
            <label>First Name <span className="req">*</span></label>
            <input name="firstName" value={form.firstName} onChange={onChange}
              className={errors.firstName ? 'err' : ''} placeholder="Enter first name" />
            {errors.firstName && <div className="err-msg">⚠ {errors.firstName}</div>}
          </div>

          {/* Last Name */}
          <div className="uf-field">
            <label>Last Name <span className="req">*</span></label>
            <input name="lastName" value={form.lastName} onChange={onChange}
              className={errors.lastName ? 'err' : ''} placeholder="Enter last name" />
            {errors.lastName && <div className="err-msg">⚠ {errors.lastName}</div>}
          </div>

          {/* Email */}
          <div className="uf-field">
            <label>Email Address <span className="req">*</span></label>
            <input type="email" name="email" value={form.email} onChange={onChange}
              className={errors.email ? 'err' : ''} placeholder="name@example.com" />
            {errors.email && <div className="err-msg">⚠ {errors.email}</div>}
          </div>

          {/* Mobile */}
          <div className="uf-field">
            <label>Mobile No <span className="req">*</span></label>
            <input name="mobileNo" value={form.mobileNo} onChange={onChange}
              className={errors.mobileNo ? 'err' : ''}
              placeholder="10-digit number" maxLength={10}
              onKeyPress={(e) => { if(!/[0-9]/.test(e.key)) e.preventDefault(); }} />
            {errors.mobileNo && <div className="err-msg">⚠ {errors.mobileNo}</div>}
          </div>

          {/* Date of Birth */}
          <div className="uf-field">
            <label>Date of Birth <span className="req">*</span></label>
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange}
              className={errors.dateOfBirth ? 'err' : ''}
              max={new Date().toISOString().split('T')[0]} />
            {errors.dateOfBirth && <div className="err-msg">⚠ {errors.dateOfBirth}</div>}
          </div>

          {/* City */}
          <div className="uf-field">
            <label>City <span className="req">*</span></label>
            <select name="city" value={form.city} onChange={onChange}
              className={errors.city ? 'err' : ''}>
              <option value="">-- Select City --</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <div className="err-msg">⚠ {errors.city}</div>}
          </div>

          {/* Gender */}
          <div className="uf-field">
            <label>Gender <span className="req">*</span></label>
            <div className="uf-radio-group">
              {['Male','Female','Other'].map(g => (
                <label key={g} className="uf-radio-opt">
                  <input type="radio" name="gender" value={g}
                    checked={form.gender === g} onChange={onChange} />
                  <span>{g}</span>
                </label>
              ))}
            </div>
            {errors.gender && <div className="err-msg">⚠ {errors.gender}</div>}
          </div>

          {/* Photo */}
          <div className="uf-field">
            <label>Photo {!isEdit && <span className="req">*</span>}</label>
            <input type="file" accept="image/*" ref={fileRef} onChange={onPhotoChange}
              className={errors.photo ? 'err' : ''} />
            {preview && (
              <div className="uf-photo-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
            {errors.photo && <div className="err-msg">⚠ {errors.photo}</div>}
          </div>

        </div>{/* /grid */}

        {/* Skills — full width */}
        <div className="uf-field uf-skills">
          <label>Professional Skills <span className="req">*</span></label>
          <div className="uf-check-group">
            {SKILLS.map(skill => (
              <label key={skill} className="uf-check-opt">
                <input type="checkbox"
                  checked={form.professionalSkills.includes(skill)}
                  onChange={() => onSkillToggle(skill)} />
                <span>{skill}</span>
              </label>
            ))}
          </div>
          {errors.professionalSkills && (
            <div className="err-msg">⚠ {errors.professionalSkills}</div>
          )}
        </div>

        {/* Action buttons */}
        <div className="uf-actions">
          <button className="btn btn-primary btn-lg" onClick={handleSaveClick}
            disabled={submitting}>
            {submitting ? '⏳ Saving…' : isEdit ? '💾 Update User' : '💾 Save User'}
          </button>
          <button className="btn btn-warning btn-lg" onClick={handleReset}
            disabled={submitting}>
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Confirm Dialogs */}
      {dialog === 'save' && (
        <ConfirmDialog
          message={`Save new user "${form.firstName} ${form.lastName}"? All details will be stored in the database.`}
          confirmLabel="Yes, Save"
          confirmClass="btn-success"
          onConfirm={handleConfirmed}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === 'update' && (
        <ConfirmDialog
          message={`Update details for "${form.firstName} ${form.lastName}"? The existing record will be overwritten.`}
          confirmLabel="Yes, Update"
          confirmClass="btn-primary"
          onConfirm={handleConfirmed}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
};

export default UserForm;
