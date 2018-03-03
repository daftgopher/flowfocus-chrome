const chrome = window.chrome;
const runtime = chrome.runtime;
const storageArea = chrome.storage.sync;

class DomainList {

  getAll(){
    return new Promise(function(resolve, reject){
      storageArea.get('domainList', function(result){
        if (runtime.lastError) {
          reject(runtime.lastError);
        }
        resolve(result.domainList || []);
      });
    });
  }

  setRecord(domainName, options = {}){
    return new Promise(function(resolve){
      this.getRecords()
      .then(function(domainList){
        // Assign new id by incrementing last id number
        let record = {
          id: domainList[domainList.length - 1].id++ || 1,
          count: 1,
          domain: domainName,
          alert: !!options.alert
        };
        domainList.push(record);
        storageArea.set({domainList: domainList}, function(){
          resolve(domainList);
        });
      });
    });
  }
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

export {DomainList, extractDomain, getActiveTabDomain, sortDescending};
