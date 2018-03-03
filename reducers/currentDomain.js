const currentDomain = (state = null, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_DOMAIN':
      return action.domain;
    default:
      return state;
  }
};

export default currentDomain;
