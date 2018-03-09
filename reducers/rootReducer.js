import { combineReducers } from 'redux';
import lastNotification from './lastNotification.js';
import currentDomain from './currentDomain.js';
import domainList from './domainList.js';
import persistentAlerts from './persistentAlerts.js';

const rootReducer = combineReducers({
  lastNotification,
  currentDomain,
  domainList,
  persistentAlerts
});

export default rootReducer;
