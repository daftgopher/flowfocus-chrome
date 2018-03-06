export const UPDATE_LAST_ALERT = 'UPDATE_LAST_ALERT';

const updateLastAlert = function(alertMessage) {
  return {
    type: UPDATE_LAST_ALERT,
    lastAlert: alertMessage
  };
};

export default updateLastAlert;
