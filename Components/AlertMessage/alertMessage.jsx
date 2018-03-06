import React from 'react';
import styles from './alertMessageStyles';

const AlertMessage = ({isActive, text}) => (
  <div id="alert-message" className={`${styles.alertMessage} ${isActive ? styles.active : ''}`}>
    {text}
  </div>
);

export default AlertMessage;
