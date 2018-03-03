import uuidV4 from 'uuid/v4';

const chrome = window.chrome;
const storageArea = chrome.storage.sync;
const runtime = chrome.runtime;

export const UPDATE_DOMAIN_COUNTS = 'UPDATE_DOMAIN_COUNTS';

const updateCounts = function(records){
  return {
    type: UPDATE_DOMAIN_COUNTS,
    records
  };
};

const updateDomainCounts = (domain) => {
  return function(dispatch){
    return storageArea.get('domainList', function(result){
      if (!runtime.lastError) {
        const records = result.domainList || [];
        const oldRecord = records.find(obj => obj.domain === domain);
        // If this is an existing record, update the count. If not
        // give it a count of 1 and a unique ID.
        let newRecord;
        if (oldRecord){
          newRecord = Object.assign({}, oldRecord, {count: oldRecord.count + 1});
        } else {
          newRecord = {
            count: 1,
            domain: domain,
            id: uuidV4()
          };
        }
        const recordIndex = oldRecord ? records.indexOf(oldRecord) : records.length;
        records[recordIndex] = newRecord;

        storageArea.set({domainList: records}, function(){
          if (!runtime.lastError) {
            dispatch(updateCounts(records));
          }
        });
      }
    });
  };
};

export default updateDomainCounts;
