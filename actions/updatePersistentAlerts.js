import { PromiseStorage } from 'Util/promiseStorage';

const actionCreator = function(persistentAlerts) {
  return {
    type: 'UPDATE_PERSISTENT_ALERTS',
    persistentAlerts
  };
};

const updatePersistentAlerts = (persistentAlerts) => {
  return async (dispatch) => {
    try {
      await PromiseStorage.set({persistentAlerts});
      return dispatch(actionCreator(persistentAlerts));
    } catch(e) {
      return new Error(e);
    }
  };
};

export default updatePersistentAlerts;
