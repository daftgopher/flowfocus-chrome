const chrome = window.chrome;
const runtime = chrome.runtime;

import PromiseStorage from 'Util/promiseStorage';

async function getAllDomains(){
  try {
    return await PromiseStorage.get('domainList');
  } catch(e) {
    return runtime.lastError;
  }
}

function findByDomain(domainList, domainName) {
  return domainList.find(domainObj => domainObj.domain === domainName);
}

function extractDomain(url){
  // Really cool way to extract domains from URLs
  // taken from http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string#answer-8498668
  let a = document.createElement('a');
  a.href = url;
  // Strip subdomain (or www.) and return
  return a.hostname.split('.').slice(-2).join('.');
}

function getActiveTabDomain(){
  return new Promise(function(resolve){
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
      resolve( extractDomain(tabs[0].url) );
    });
  });
}

function sortAlphabetically(arr){
  return arr.sort( (a, b) => {
    if (a.domain < b.domain){
      return -1;
    } else if (a.domain > b.domain) {
      return 1;
    } else {
      return 0;
    }
  });
}

function sortDescending(arr){
  return arr.sort((a, b) => {
    if (a.count < b.count){
      return -1;
    } else if (a.count > b.count){
      return 1;
    } else {
      return 0;
    }
  }).reverse();
}

export {getAllDomains, extractDomain, getActiveTabDomain, sortDescending, sortAlphabetically, findByDomain};
