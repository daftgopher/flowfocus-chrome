import { combineReducers } from 'redux';
import lastAlert from './lastAlert.js';
import currentDomain from './currentDomain.js';
import domainList from './domainList.js';

const rootReducer = combineReducers({
  lastAlert,
  currentDomain,
  domainList
});

export default rootReducer;
