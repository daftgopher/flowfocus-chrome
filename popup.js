import './stylesheets/popup.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App/app.jsx';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import { getActiveTabDomain } from 'Util/domainUtil';

const chrome = chrome || window.chrome;

document.addEventListener('DOMContentLoaded', function(){
  const store = new Store({
    portName: 'FLOWFOCUS_APP'
  });

  store.ready().then( () => {
    // Update the current domain whenever the popup is loaded
    // console.log('Getting active domain');
    getActiveTabDomain().then(domain => {
      if (domain !== 'newtab') {
        store.dispatch({
          type: 'UPDATE_CURRENT_DOMAIN',
          domain
        });
      }
    });

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>
      , document.getElementById('app'));
  });
});
