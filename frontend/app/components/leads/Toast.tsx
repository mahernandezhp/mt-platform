"use client";
import { useEffect } from 'react';
import { 
  CheckCircledIcon, 
  CrossCircledIcon, 
  Cross2Icon 
} from '@radix-ui/react-icons';

interface ToastProps {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Toast({ 
  isVisible, 
  message, 
  type, 
  onClose,
  autoClose = true,
  duration = 5000
}: ToastProps) {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div className={`text-white px-8 py-6 rounded-lg shadow-xl flex items-center space-x-4 animate-slide-in max-w-md pointer-events-auto ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}>
        {type === 'success' ? (
          <CheckCircledIcon className="w-6 h-6" />
        ) : (
          <CrossCircledIcon className="w-6 h-6" />
        )}
        <div>
          <div className="font-semibold text-lg">{message}</div>
          <div className="text-sm opacity-90 mt-1">
            {type === 'success' ? 'Operación completada' : 'Por favor revise los datos'}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 p-1"
        >
          <Cross2Icon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}