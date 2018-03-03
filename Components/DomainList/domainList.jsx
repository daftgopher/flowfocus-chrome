import React from 'react';
import styles from './domainListStyles.scss';
// import classnames from 'classnames';

import { sortDescending } from 'Util/domainUtil.js';

// const cx = classnames.bind(styles);

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
                <td>{item.domain}</td>
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
