import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastAlert = ({ message, type = 'success', onClose, show }) => {
  const [showToast, setShowToast] = useState(show);

  useEffect(() => {
    setShowToast(show);
  }, [show]);

  const handleClose = () => {
    setShowToast(false);
    onClose && onClose();
  };

  const variant = type === 'error' ? 'danger' : type;

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast 
        show={showToast} 
        onClose={handleClose} 
        delay={5000} 
        autohide
        bg={variant}
      >
        <Toast.Header>
          <strong className="me-auto">
            {type === 'success' ? 'Success' : 'Error'}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-white">
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastAlert;
