import React from 'react';
import styles from './toastNotificationStyles';

const ToastNotification = ({isActive, text}) => (
  <div id="toast-message" className={`${styles.toastNotification} ${isActive ? styles.active : ''}`}>
    {text}
  </div>
);

export default ToastNotification;
