const chrome = window.chrome;

import { extractDomain } from 'Util/domainUtil';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { alias, wrapStore } from 'react-chrome-redux';

import { getAllDomains, getActiveTabDomain, findByDomain } from 'Util/domainUtil';
import maybeShowAlert from 'Util/maybeShowAlert';

import updateDomainProperties from 'Actions/updateDomainProperties';
import updateCurrentDomain from 'Actions/updateCurrentDomain';
import updateDomainCounts from 'Actions/updateDomainCounts';
import cleanIfNewDay from 'Actions/cleanIfNewDay';

import rootReducer from 'Reducers/rootReducer';

let store;

const aliases = {
  'update-domain-properties': ({domain, propertiesObj}) => {
    store.dispatch(updateDomainProperties(domain, propertiesObj));
    return {type: 'NOOP'};
  }
};


async function setupStore(){
  let records = await getAllDomains();
  store = createStore(
    rootReducer,
    {
      domainList: records
    },
    applyMiddleware(
      alias(aliases),
      ReduxThunk
    )
  );
  const activeDomain = await getActiveTabDomain();
  store.dispatch(updateCurrentDomain(activeDomain));
  if (activeDomain !== 'newtab'){
    store.dispatch(updateDomainCounts(activeDomain));
  }
  wrapStore(store, {portName: 'FLOWFOCUS_APP'});
  store.dispatch(cleanIfNewDay());
  window.reduxStore = store; // For debugging
}

setupStore();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log('Tab ID: ', tabId);
  console.log('Change Info: ', changeInfo);
  // console.log('Tab: ', tab);
  if (changeInfo.url){
    const newDomain = extractDomain(tab.url);
    chrome.storage.sync.get('currentDomain', function(result){
      if (newDomain !== result.currentDomain) {
        store.dispatch(updateCurrentDomain(newDomain));
        if (newDomain !== 'newtab'){
          store.dispatch(updateDomainCounts(newDomain)).then(result => {
            maybeShowAlert(findByDomain(result.records, newDomain));
          });
        }
      }
    });
  }

  if (changeInfo.favIconUrl) {
    // someday do stuff to save image later here...
  }
});
