import React from 'react';
import styles from './domainListStyles.scss';

import { sortDescending } from 'Util/domainUtil.js';

import BellImage from 'Images/notification_bell.svg';

const DomainList = ({domainList}) => {
  return (
    <div id="domain-list" className={styles.domainList}>
      <table id="dataTable">
        <thead>
          <tr>
            <th>Site</th>
            <th>Visits Today</th>
          </tr>
        </thead>
        <tbody id="dataTable-rows">
          {sortDescending(domainList).map( (item, idx) => {
            return (
              <tr key={idx}>
                <td>
                  {item.domain}
                  {item.hasAlert &&
                    <span title="This site will provide notification alerts">
                      <BellImage className={styles.bellIcon} />
                    </span>
                  }
                </td>
                <td>{item.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

  );
};

export default DomainList;
