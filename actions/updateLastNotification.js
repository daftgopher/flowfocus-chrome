export const UPDATE_LAST_NOTIFICATION = 'UPDATE_LAST_NOTIFICATION';

const updateLastNotification = function(message) {
  return {
    type: UPDATE_LAST_NOTIFICATION,
    lastNotification: message
  };
};

export default updateLastNotification;
