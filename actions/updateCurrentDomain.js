const chrome = window.chrome;
const runtime = chrome.runtime;
import { PromiseStorage } from 'Util/promiseStorage';

export const UPDATE_CURRENT_DOMAIN = 'UPDATE_CURRENT_DOMAIN';

const postingDomain = function(newDomain){
  return {
    type: UPDATE_CURRENT_DOMAIN,
    domain: newDomain
  };
};

const updateCurrentDomain = (newDomain) => {
  return async function(dispatch){
    await PromiseStorage.set({currentDomain: newDomain});
    if (!runtime.lastError) {
      dispatch(postingDomain(newDomain));
    }
  };
};

export default updateCurrentDomain;
