import { DomainRecords } from 'Util/domainUtil';
import { createStore } from 'redux';
import rootReducer from 'Reducers/rootReducer';

let store;
console.log('Store.js loaded');

const domainRecords = new DomainRecords();

async function setupStore(){
  if (store) return store;
  let records = await domainRecords.getAll();
  store = createStore(rootReducer, {domainList: records, domainAlerts: []});
  return store;
}

export default setupStore;
