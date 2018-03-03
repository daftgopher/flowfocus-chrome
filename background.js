const chrome = window.chrome;

import { extractDomain } from 'Util/domainUtil';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { wrapStore } from 'react-chrome-redux';
import { DomainList, getActiveTabDomain } from 'Util/domainUtil';
import { PromiseStorage } from 'Util/promiseStorage';

import updateCurrentDomain from 'Actions/updateCurrentDomain';
import updateDomainCounts from 'Actions/updateDomainCounts';
import cleanIfNewDay from 'Actions/cleanIfNewDay';

import rootReducer from 'Reducers/rootReducer';

const domainList = new DomainList();

let store;

async function setupStore(){
  let records = await domainList.getAll();
  store = createStore(
    rootReducer,
    {
      domainList: records,
      domainAlerts: []
    },
    applyMiddleware(thunkMiddleware)
  );
  const activeDomain = await getActiveTabDomain();
  store.dispatch(updateCurrentDomain(activeDomain));
  if (activeDomain !== 'newtab'){
    store.dispatch(updateDomainCounts(activeDomain));
  }
  wrapStore(store, {portName: 'FLOWFOCUS_APP'});
  store.dispatch(cleanIfNewDay());
}

setupStore();

window.getStorageArea = function(){
  chrome.storage.sync.get(null, (res) => console.log('Storage: ', res));
};

window.setStorageArea = (obj) => PromiseStorage.set(obj).then( () => {
  PromiseStorage.get(null).then( (res) => console.log(res) );
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url){
    const newDomain = extractDomain(tab.url);
    chrome.storage.sync.get('currentDomain', function(result){
      if (newDomain !== result.currentDomain) {
        store.dispatch(updateCurrentDomain(newDomain));
        if (newDomain !== 'newtab'){
          store.dispatch(updateDomainCounts(newDomain));
        }
      }
    });
  }
});
