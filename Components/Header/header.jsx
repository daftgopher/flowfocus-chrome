import React from 'react';
import styles from './headerStyles.scss';

const Header = () => (
  <header>
    <figure className={styles.headerWrap}>
      <img src="images/logo.png" alt="flow logo" />
    </figure>
  </header>
);

export default Header;
