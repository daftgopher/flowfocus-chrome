import { PromiseStorage } from 'Util/promiseStorage';

import updatePersistentAlerts from 'Actions/updatePersistentAlerts';

export const CLEAR_STORE = 'CLEAR_STORE';
export const NOOP = 'NOOP';

const chrome = window.chrome;

const cleanOldNotifications = () => {
  chrome.notifications.getAll(notifications => {
    const keys = Object.keys(notifications);
    keys.forEach( key => {
      chrome.notifications.clear(key);
    });
  });
};

async function getPersistentAlerts(){
  let {persistentAlerts = [], domainList = []} = await PromiseStorage.get(['persistentAlerts', 'domainList']);

  // Return an array of domain names
  return persistentAlerts.concat(
    domainList.filter(domainObj => domainObj.hasAlert).map(domainObj => domainObj.domain)
  );
}

function cleanIfNewDay(currentDay) {
  return async function(dispatch){
    cleanOldNotifications();
    const persistentAlerts = await getPersistentAlerts();
    await PromiseStorage.clear();
    PromiseStorage.set({lastDayUpdated: currentDay});
    dispatch(clean(currentDay));
    dispatch(updatePersistentAlerts(persistentAlerts));
  };
}

const clean = function(day, persistentAlerts){
  return {
    type: CLEAR_STORE,
    action: {
      lastDayUpdated: day,
      persistentAlerts
    }
  };
};

export default cleanIfNewDay;
