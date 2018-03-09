const chrome = window.chrome;

import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { alias, wrapStore } from 'react-chrome-redux';

import { extractDomain, getAllDomains, getActiveTabDomain, findByDomain } from 'Util/domainUtil';
import maybeShowAlert from 'Util/maybeShowAlert';
import { PromiseStorage } from 'Util/promiseStorage';

import cleanIfNewDay from 'Actions/cleanIfNewDay';
import updateCurrentDomain from 'Actions/updateCurrentDomain';
import updateDomainCounts from 'Actions/updateDomainCounts';
import updateDomainProperties from 'Actions/updateDomainProperties';

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
  const currentDay = new Date().getDate();
  const { lastDayUpdated } = await PromiseStorage.get('lastDayUpdated');
  if (currentDay !== lastDayUpdated) {
    store.dispatch(cleanIfNewDay(currentDay));
  }
}

setupStore();

async function updateDomainStats(newDomain){
  store.dispatch(updateCurrentDomain(newDomain));
  if (newDomain !== 'newtab'){
    const {records} = await store.dispatch(updateDomainCounts(newDomain));
    const domainObj = findByDomain(records, newDomain);
    maybeShowAlert(domainObj);
    return domainObj;
  }
  return {};
}

function updateBadgeCount(domainObj){
  if (domainObj && !domainObj.muted && domainObj.count > 0){
    chrome.browserAction.setBadgeText({text: String(domainObj.count)});
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url){
    const newDomain = extractDomain(tab.url);
    chrome.storage.sync.get(['currentDomain', 'lastDayUpdated'], function(result){
      if (newDomain !== result.currentDomain) {
        // Check if this is a new day and reset the store if so
        const currentDay = new Date().getDate();
        if (currentDay !== result.lastDayUpdated) {
          store.dispatch(cleanIfNewDay(currentDay).then(() => {
            updateDomainStats(newDomain).then(domainObj => updateBadgeCount(domainObj));
          }));
        } else {
          updateDomainStats(newDomain).then(domainObj => updateBadgeCount(domainObj));
        }
      }
    });
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const domain = extractDomain(tab.url);
    PromiseStorage.get('domainList').then(res => {
      const domainObj = findByDomain(res.domainList, domain);
      updateBadgeCount(domainObj);
    });
  });
});

chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIdx) => {
  if (notificationId === 'maxVisitsReached' && buttonIdx === 0){
    const {currentDomain} = await PromiseStorage.get('currentDomain');
    store.dispatch(updateDomainProperties(currentDomain, {isMuted: true}));
  }
});
