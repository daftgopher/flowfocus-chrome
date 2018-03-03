const chrome = window.chrome;
const storageArea = chrome.storage.sync;

export const TOGGLE_FORM = 'TOGGLE_FORM';
export const CLEAR_FORM  = 'CLEAR_FORM';

const toggleForm = function(){
  return {
    type: TOGGLE_FORM
  };
};

const clearForm = async function(){
  await storageArea.clear();
  return {
    type: CLEAR_FORM
  };
};

export {toggleForm, clearForm};
