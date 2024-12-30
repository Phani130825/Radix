import React from 'react';
import './../styles/CustomDialog.css';

const CustomDialog = ({ title, message, onClose }) => {
  return (
    <div className="custom-dialog-backdrop">
      <div className="custom-dialog-box">
        <h2 className="dialog-title">{title}</h2>
        <p className="dialog-message">{message}</p>
        <button className="dialog-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomDialog;
