import React from 'react';
import styles from './currentDomainStatusStyles.scss';

const CurrentDomainStatus = ({name, count}) => {
  return(
    <p className={styles.wrap}>You've currently visited {name} <strong>{count} {count === 1 ? 'time' : 'times'}</strong> today.</p>
  );
};

export default CurrentDomainStatus;
