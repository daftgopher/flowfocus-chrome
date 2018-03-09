import uuidV4 from 'uuid/v4';

import { PromiseStorage } from 'Util/promiseStorage';

export const UPDATE_DOMAIN_COUNTS = 'UPDATE_DOMAIN_COUNTS';

const updateCounts = function(records){
  return {
    type: UPDATE_DOMAIN_COUNTS,
    records
  };
};

const updateDomainCounts = (domainName) => {
  return async function(dispatch){
    try {
      const {domainList = []} = await PromiseStorage.get('domainList');
      const {persistentAlerts = []} = await PromiseStorage.get('persistentAlerts');
      const oldRecord = domainList.find(item => item.domain === domainName);
      let newRecord;
      if (oldRecord){
        newRecord = Object.assign({}, oldRecord, {count: oldRecord.count + 1});
      } else {
        newRecord = {
          count: 1,
          domain: domainName,
          id: uuidV4(),
          hasAlert: persistentAlerts.includes(domainName)
        };
      }
      const domainListIndex = oldRecord ? domainList.indexOf(oldRecord) : domainList.length;
      domainList[domainListIndex] = newRecord;
      const updatedRecords = await PromiseStorage.set({domainList});
      return dispatch(updateCounts(updatedRecords.domainList));
    } catch(e) {
      return new Error(e);
    }
  };
};

export default updateDomainCounts;
