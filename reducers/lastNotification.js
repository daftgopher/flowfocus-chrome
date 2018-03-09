const lastNotification = (state = null, action) => {
  switch (action.type) {
    case 'UPDATE_LAST_NOTIFICATION':
      return action.lastNotification;
    default:
      return state;
  }
};

export default lastNotification;
