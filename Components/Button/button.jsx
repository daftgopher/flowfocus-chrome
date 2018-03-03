import React from 'react';
import styles from './buttonStyles.scss';

const Button = ({clickHandler, text, isForm}) => {

  const handleClick = (e) => {
    e.preventDefault();
    clickHandler();
  };

  return(
    <button className={styles.buttonPrimary} onClick={handleClick}>{text}</button>
  );
};
export default Button;
