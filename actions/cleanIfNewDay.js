import { PromiseStorage } from 'Util/promiseStorage';

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

function cleanIfNewDay() {
  return async function(dispatch){
    const currentDay = new Date().getDate();
    const lastDay = await PromiseStorage.get('lastDayUpdated').then(res => res.lastDayUpdated);

    if (currentDay !== lastDay) {
      cleanOldNotifications();
      await PromiseStorage.clear();
      PromiseStorage.set({lastDayUpdated: currentDay});
      dispatch(clean(currentDay));
    } else {
      dispatch({
        type: 'NOOP'
      });
    }
  };
}

const clean = function(day){
  return {
    type: CLEAR_STORE,
    action: {
      lastDayUpdated: day
    }
  };
};

export default cleanIfNewDay;
