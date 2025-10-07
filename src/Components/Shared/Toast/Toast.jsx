import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Toast.module.css';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.iconWrapper}>
        {getIcon()}
      </div>
      <p className={styles.message}>{message}</p>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

export default Toast;
