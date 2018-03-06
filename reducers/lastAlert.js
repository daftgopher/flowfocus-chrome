const lastAlert = (state = null, action) => {
  switch (action.type) {
    case 'UPDATE_LAST_ALERT':
      return action.lastAlert;
    default:
      return state;
  }
};

export default lastAlert;
