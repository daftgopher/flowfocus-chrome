const chrome = window.chrome;

import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { alias, wrapStore } from 'react-chrome-redux';

import cleanIfNewDay from 'Actions/cleanIfNewDay';
import updateCurrentDomain from 'Actions/updateCurrentDomain';
import updateDomainCounts from 'Actions/updateDomainCounts';
import updateDomainProperties from 'Actions/updateDomainProperties';

import rootReducer from 'Reducers/rootReducer';

import { extractDomain, getAllDomains, getActiveTabDomain, findByDomain } from 'Util/domainUtil';
import maybeShowAlert from 'Util/maybeShowAlert';
import { PromiseStorage } from 'Util/promiseStorage';

let store;

// react-chrome-redux uses aliases to dispatch actions
// between the stores on the popup and background scripts
const aliases = {
  'update-domain-properties': ({domain, propertiesObj}) => {
    store.dispatch(updateDomainProperties(domain, propertiesObj));
    // Return blank action to prevent redux errors in the popup.js proxy store
    // while the main action runs on the background script
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
  await store.dispatch(updateCurrentDomain(activeDomain));
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
  await store.dispatch(updateCurrentDomain(newDomain));
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
    return chrome.browserAction.setBadgeText({text: String(domainObj.count)});
  }
  return chrome.browserAction.setBadgeText({text: ''});
}

async function checkIfShouldCleanStore(){
  // Check if this is a new day and reset the store if so
  const currentDay = new Date().getDate();
  const {lastDayUpdated} = await PromiseStorage.get('lastDayUpdated');
  if (currentDay !== lastDayUpdated) {
    await store.dispatch(cleanIfNewDay(currentDay));
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url){
    const newDomain = extractDomain(tab.url);
    chrome.storage.sync.get(['currentDomain', 'lastDayUpdated'], async function(result){
      if (newDomain !== result.currentDomain) {
        await checkIfShouldCleanStore();
        const domainObj = await updateDomainStats(newDomain);
        updateBadgeCount(domainObj);
      }
    });
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, async (tab) => {
    const domain = extractDomain(tab.url);
    await store.dispatch(updateCurrentDomain(domain));
    await checkIfShouldCleanStore();

    const {domainList} = await PromiseStorage.get('domainList');
    const domainObj = findByDomain(domainList, domain);
    updateBadgeCount(domainObj);
  });
});

chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIdx) => {
  if (notificationId === 'maxVisitsReached' && buttonIdx === 0){
    const {currentDomain} = await PromiseStorage.get('currentDomain');
    store.dispatch(updateDomainProperties(currentDomain, {isMuted: true}));
  }
});
