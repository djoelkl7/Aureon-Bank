
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-400" />,
    error: <XCircle className="text-red-400" />,
    info: <Info className="text-blue-400" />,
    warning: <AlertTriangle className="text-yellow-400" />,
  };

  const borderColors = {
    success: 'border-emerald-500',
    error: 'border-red-500',
    info: 'border-blue-500',
    warning: 'border-yellow-500',
  };

  return (
    <div className={`fixed top-4 right-4 glass ${borderColors[type]} border-l-4 p-4 rounded-lg shadow-2xl flex items-center space-x-3 z-50 animate-slide-in`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">&times;</button>
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const ToastContainer = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  ) : null;

  return { showToast, ToastContainer };
};
