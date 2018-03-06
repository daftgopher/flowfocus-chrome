const emptyState = {
  currentDomain: undefined,
  domainList: [],
  formActive: false,
  lastDayUpdated: undefined
};

const domainList = (state = {domainList: []}, action) => {
  switch(action.type){
    case 'ADD_DOMAIN':
      return [...state, {count: 1, domain: action.domain, hasAlert: !!action.hasAlert}];
    case 'UPDATE_DOMAIN_PROPERTIES':
      return action.records;
    case 'UPDATE_DOMAIN_COUNTS':
      return action.records;
    case 'CLEAR_STORE':
      return {...emptyState, lastDayUpdated: action.lastDayUpdated};
    default:
      return state;
  }
};

export default domainList;
