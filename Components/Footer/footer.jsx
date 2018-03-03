import React from 'react';
import styles from './footerStyles.scss';

import Button from 'Components/Button/button.jsx';

const Footer = ({clickHandler}) => (
  <footer className={styles.footer}>
    <Button clickHandler={clickHandler} text={'Add Distraction Alert'} />
  </footer>
);

export default Footer;
