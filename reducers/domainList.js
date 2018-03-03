const emptyState = {
  currentDomain: undefined,
  domainList: [],
  domainAlerts: [],
  formActive: false,
  lastDayUpdated: undefined
};

const domainList = (state = {domainList: []}, action) => {
  switch(action.type){
    case 'ADD_DOMAIN':
      return [...state, {count: 1, domain: action.domain}];
    case 'UPDATE_DOMAIN_COUNTS':
      return action.records;
    case 'CLEAR_STORE':
      return {...emptyState, lastDayUpdated: action.lastDayUpdated};
    default:
      return state;
  }
};

export default domainList;
