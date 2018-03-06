import React from 'react';
import styles from './buttonStyles.scss';

const Button = ({clickHandler, text, disabled}) => {

  const handleClick = (e) => {
    e.preventDefault();
    clickHandler();
  };

  return(
    <button className={styles.buttonPrimary} onClick={handleClick} disabled={disabled}>{text}</button>
  );
};
export default Button;
