import React from 'react';
import styles from './buttonStyles.scss';

const Button = ({clickHandler, text, disabled, type = 'primary'}) => {

  const handleClick = (e) => {
    e.preventDefault();
    clickHandler();
  };

  const classNames = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary
  };

  return(
    <button className={classNames[type]} onClick={handleClick} disabled={disabled}>{text}</button>
  );
};
export default Button;
