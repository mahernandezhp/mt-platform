import React, { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  show: boolean;
  message: string;
  type: ToastType;
  onClose: () => void;
  showCloseButton?: boolean;
  duration?: number;
}

export default function Toast({ 
  show, 
  message, 
  type, 
  onClose, 
  showCloseButton = true, 
  duration = 3000 
}: ToastProps) {
  React.useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const typeColors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className={`px-6 py-4 rounded-lg shadow-lg max-w-md ${typeColors[type]} flex items-center justify-between`}>
        <span className="text-sm font-medium">{message}</span>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// Hook personalizado para manejar Toast
export function useToast() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const showToast = useCallback((msg: string, toastType: ToastType = 'info') => {
    setMessage(msg);
    setType(toastType);
    setShow(true);
  }, []);

  const hideToast = useCallback(() => {
    setShow(false);
  }, []);

  return {
    show,
    message,
    type,
    showToast,
    hideToast
  };
}
