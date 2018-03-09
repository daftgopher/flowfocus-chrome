import { PromiseStorage } from 'Util/promiseStorage';

const updateProperties = function(records) {
  return {
    type: 'UPDATE_DOMAIN_PROPERTIES',
    records
  };
};

const updateDomainProperties = (domainName, propertiesObj) => {
  return async (dispatch) => {
    try {
      let {domainList} = await PromiseStorage.get('domainList');
      let domainIdx = domainList.findIndex(item => item.domain === domainName);
      domainList[domainIdx] = {...domainList[domainIdx], ...propertiesObj};
      const updatedRecords = await PromiseStorage.set({domainList});
      return dispatch(updateProperties(updatedRecords.domainList));
    } catch(e) {
      return new Error(e);
    }
  };
};

export default updateDomainProperties;
