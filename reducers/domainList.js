const domainList = (state = [], action) => {
  switch(action.type){
    case 'UPDATE_DOMAIN_PROPERTIES':
      return action.records;
    case 'UPDATE_DOMAIN_COUNTS':
      return action.records;
    case 'CLEAR_STORE':
      return [];
    default:
      return state;
  }
};

export default domainList;
