import React from 'react';
import styles from './domainFormStyles.scss';

import Button from 'Components/Button/button.jsx';

const DomainForm = ({submitHandler, isError}) => (

  <div id="form" className={styles.domainForm}>
    <form action="" onSubmit={submitHandler} className={styles.domainFormEl}>
      <p className="lead">Which sites you like to be notified about when you're slacking?</p>
      <input id="alert-input" type="text" placeholder="Enter a website" />
      <Field name="domain" component="input" type="text" />
      {isError && <p id="error-text" className="error"></p>}
      <small className={styles.inputNote}>
        <strong>Examples:</strong> facebook.com, twitter.com, reddit.com, wikipedia.org. Make sure to include the
        domain (e.g. ".com")
      </small>
      <Button text="Add Alert" />
    </form>
  </div>

);

// DomainForm = reduxForm({
//   form: 'domainAlert'
// })(DomainForm);

export default DomainForm;
