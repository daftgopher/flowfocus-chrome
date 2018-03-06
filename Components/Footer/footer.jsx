import React from 'react';
import styles from './footerStyles.scss';

import Button from 'Components/Button/button.jsx';

const Footer = ({clickHandler, currentDomain, hasAlert}) => (
  <footer className={styles.footer}>
    { !hasAlert &&
      <Button clickHandler={clickHandler} text={`Add Distraction Alert for ${currentDomain}`} />
    }
    { !!hasAlert &&
      <div><strong>{currentDomain}</strong> is being monitored and will alert you if it is visited repeatedly.</div>
    }
  </footer>
);

export default Footer;
