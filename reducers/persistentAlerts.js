const persistentAlerts = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_PERSISTENT_ALERTS':
      return action.persistentAlerts;
    default:
      return state;
  }
};

export default persistentAlerts;
