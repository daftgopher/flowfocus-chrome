import { combineReducers } from 'redux';
import currentDomain from './currentDomain.js';
import domainList from './domainList.js';
import form from './form.js';
import { reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  currentDomain,
  domainList,
  form: formReducer
});

export default rootReducer;
