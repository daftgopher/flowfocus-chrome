import uuidV4 from 'uuid/v4';

// const chrome = window.chrome;
// const storageArea = chrome.storage.sync;
// const runtime = chrome.runtime;

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
      const { domainList = []} = await PromiseStorage.get('domainList');
      const oldRecord = domainList.find(item => item.domain === domainName);
      let newRecord;
      if (oldRecord){
        newRecord = Object.assign({}, oldRecord, {count: oldRecord.count + 1});
      } else {
        newRecord = {
          count: 1,
          domain: domainName,
          id: uuidV4()
        };
      }
      const domainListIndex = oldRecord ? domainList.indexOf(oldRecord) : domainList.length;
      domainList[domainListIndex] = newRecord;
      const updatedRecords = await PromiseStorage.set({domainList});
      return dispatch(updateCounts(updatedRecords.domainList));
    } catch(e) {
      return new Error(e);
    }

    // return storageArea.get('domainList', function(result){
    //   if (!runtime.lastError) {
    //     const records = result.domainList || [];
    //     const oldRecord = records.find(obj => obj.domain === domainName);
    //     // If this is an existing record, update the count. If not
    //     // give it a count of 1 and a unique ID.
    //     let newRecord;
    //     if (oldRecord){
    //       newRecord = Object.assign({}, oldRecord, {count: oldRecord.count + 1});
    //     } else {
    //       newRecord = {
    //         count: 1,
    //         domain: domainName,
    //         id: uuidV4()
    //       };
    //     }
    //     const recordIndex = oldRecord ? records.indexOf(oldRecord) : records.length;
    //     records[recordIndex] = newRecord;
    //
    //     storageArea.set({domainList: records}, function(){
    //       if (!runtime.lastError) {
    //         dispatch(updateCounts(records));
    //       }
    //     });
    //   }
    // });
  };
};

export default updateDomainCounts;
