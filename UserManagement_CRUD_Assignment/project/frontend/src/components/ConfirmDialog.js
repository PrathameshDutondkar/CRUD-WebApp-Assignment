import React from 'react';
import './ConfirmDialog.css';

/**
 * Reusable animated confirmation modal.
 * Props: message, onConfirm, onCancel, confirmLabel, confirmClass
 */
const ConfirmDialog = ({
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Yes, Confirm',
  confirmClass = 'btn-danger',
}) => (
  <div className="cd-overlay" onClick={onCancel}>
    <div className="cd-box" onClick={(e) => e.stopPropagation()}>
      <div className="cd-icon">⚠️</div>
      <h3 className="cd-title">Confirm Action</h3>
      <p className="cd-message">{message}</p>
      <div className="cd-actions">
        <button className={`btn ${confirmClass}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
