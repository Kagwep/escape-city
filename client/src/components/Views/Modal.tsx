import React from 'react';
import './style.css'

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className='text-cyan-400'>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-primary text-cyan-500" onClick={onConfirm}>Confirm</button>
          <button className="btn btn-secondary text-red-500" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
