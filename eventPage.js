// Note: Not currently used

const chrome = window.chrome;

import { extractDomain } from 'Util/domainUtil';
// import setupStore from './store';
import { wrapStore } from 'react-chrome-redux';
import updateCurrentDomain from 'Actions/updateCurrentDomain';
// import updateCurrentDomain from 'Actions/updateCurrentDomain';

// const domainRecords = new DomainRecords();

// function getTabDomain(){
// 	return new Promise(function(resolve, reject){
// 		chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
// 			resolve( extractDomain(tabs[0].url) );
// 		});
// 	});
// }

// const runtime = chrome.runtime;

// function checkDate(){
//   return new Promise(function(resolve, reject){
//
//     const storage = chrome.storage.sync;
//
//     storage.get('lastDate', function(result){
//       if (runtime.lastError) {
//         reject(runtime.lastError);
//       } else {
//         let currentDate = new Date().toDateString();
//         if (currentDate !== result.lastDate) {
//           storage.set({lastDate: currentDate}, function(){
//             if (runtime.lastError){
//               reject(runtime.lastError);
//             } else {
//               // Purge data if the date has changed
//               storage.set({domainRecords: [] }, function(){
//                 resolve(true);
//               });
//             }
//           });
//         } else {
//           resolve(true);
//         }
//       }
//     });
//
//   });
// }

// function createNotification(domain, message){
//
//   const overageMessages = { // Maybe convert this to a Map?
//     three: {
//       type: 'basic',
//       iconUrl: 'images/notifications.png',
//       title: 'Third Time\'s Lost Its Charm...',
//       message: `Heads up, you've visited ${domain} 3 times today already. Stay focused, friend!`
//     },
//
//     six: {
//       type: 'basic',
//       iconUrl: 'images/notifications.png',
//       title: 'Six Times Now, Dude',
//       message: `Careful now, you've now visited ${domain} 6 times today. Close the tab and get back on task!`
//     }
//   };
//
//   chrome.notifications.create(undefined, overageMessages[message]);
// }

// const storage = chrome.storage.sync;
//
// function updateUrlCount(url){
//
//   storage.get('domainRecords', function(result){
//     let domainRecords = result.domainRecords || [];
//     let domainRecord = domainRecords.find( (record) => record.domain === url );
//     if (domainRecord){
//       let domainRecordIndex = domainRecords.indexOf(domainRecords);
//       // Update the count
//       domainRecord.count = domainRecord.count ? ++domainRecord.count : 1;
//
//       // Replace the object in the array and save it
//       domainRecords[domainRecordIndex] = domainRecord;
//
//       // Alert the user if they're supposed to be avoiding this domain
//       storage.get('userAlerts', function(res){
//         let userAlerts = res.userAlerts;
//
//         // Check if the domain is in the list of watched domains
//         if (userAlerts.indexOf(domainRecord.domain) !== -1){
//           if (domainRecord.count === 3){
//             createNotification(url, 'three');
//           } else if (domainRecord.count === 6){
//             createNotification(url, 'six');
//           }
//         }
//
//       });
//     } else {
//       // Create the new record
//       domainRecord = {domain: url, count: 1};
//       domainRecords.push(domainRecord);
//     }
//
//     storage.set({domainRecords: domainRecords}, function(){
//       // console.log(domainRecords);
//     });
//   });
//
// }

// function getDomainRecords(){
//   return new Promise(function(resolve, reject){
//     chrome.storage.sync.get('domainRecords', function(result){
//       return result.domainRecords || [];
//     }, (err) => reject(err));
//   });
// }

// function createDomainRecord(record = {}){
//   return new Promise(function(resolve, reject){
//     getDomainRecords()
//     .then(function(domainRecords){
//       // Assign new id by incrementing last id number
//       record.id = domainRecords[domainRecords.length - 1].id++ || 1
//       domainRecords.push(record);
//       chrome.storage.set({domainRecords: domainRecords}, function(){
//         resolve(domainRecords);
//       });
//     });
//   });
// }

let store;

wrapStore(store, {portName: 'FLOWFOCUS_APP'});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url){
    const newDomain = extractDomain(tab.url);
    chrome.storage.sync.get('currentDomain', function(result){
      if (newDomain !== result.currentDomain) {
        store.dispatch(updateCurrentDomain(newDomain));
      }
      if (newDomain !== 'newtab'){
        // updateUrlCount(domain);
        // store.dispatch(updateDomainCount(newDomain));
      }
    });
  }
});
