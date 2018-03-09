import React from 'react';
import styles from './domainAlertListStyles.scss';

import { sortAlphabetically } from 'Util/domainUtil.js';

import Button from 'Components/Button/button.jsx';

const DomainAlertList = ({domainList, removeAlert, backToList}) => {
  const sortedDomainList = sortAlphabetically(domainList);
  return (
    <div id="domain-list" className={styles.domainList}>
      <table id="dataTable">
        <thead>
          <tr>
            <th colSpan="2">Site</th>
          </tr>
        </thead>
        <tbody id="dataTable-rows">
          {sortedDomainList.map( (item, idx) => {
            return (
              <tr key={idx}>
                <td>
                  {item.domain}
                </td>
                <td>
                  <span
                    className={styles.remove}
                    onClick={() => removeAlert(item.domain)}
                  >
                    &times; Remove Alert
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.backButton} onClick={backToList}>
        <Button clickHandler={backToList} text={'Back to List'} type="secondary" />
      </div>
    </div>

  );
};

export default DomainAlertList;
