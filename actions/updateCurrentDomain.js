const chrome = window.chrome;
const storageArea = chrome.storage.sync;
const runtime = chrome.runtime;

export const UPDATE_CURRENT_DOMAIN = 'UPDATE_CURRENT_DOMAIN';

const postingDomain = function(newDomain){
  return {
    type: UPDATE_CURRENT_DOMAIN,
    domain: newDomain
  };
};

const updateCurrentDomain = (newDomain) => {
  return function(dispatch){
    return storageArea.set({currentDomain: newDomain}, function(){
      if (!runtime.lastError) {
        dispatch(postingDomain(newDomain));
      }
    });
  };
};

export default updateCurrentDomain;
