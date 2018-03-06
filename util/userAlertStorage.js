// const chrome = window.chrome;

import PromiseStorage from 'Util/promiseStorage';
// import extractDomain from 'Util/extractDomain';

export default class UserAlertStorage {

  async get(){
    const result = await PromiseStorage.get('domainList');
    if (!result.domainList) return [];
    return result.domainList.filter(item => item.hasAlert);
    // return new Promise(function(resolve, reject){
    //   chrome.storage.sync.get('userAlerts', function(result){
    //     return result.userAlerts || [];
    //   }, (err) => reject(err));
    // });
  }

  // async set(userDomain){
  //   // Check if the user has already entered this alert
  //   let domainItemsWithAlerts = await this.get();
  //   const candidateDomain = extractDomain(userDomain);
  //   if (domainItemsWithAlerts.find( item => item.name === candidateDomain)){
  //     return new Error('You\'ve already logged an alert for that domain');
  //   }
  //   userAlerts.push(domain);
  //   let newRecord = await PromiseStorage.set({userAlerts});
  //   await this.updateDomainRecordWithAlert(domain);
  //   return newRecord;
  // }
  // // create(alertDomainName){
  //
  // async updateDomainRecordWithAlert(domain){
  //   let domainList = await PromiseStorage.get('domainList');
  //   const matchingDomainItem = domainList.find(item => item.domain === domain);
  //   matchingDomainItem.hasAlert = true;
  //   PromiseStorage.set()
  // }



    // this.get()
    // .then(function(userAlerts){
    //   return new Promise(function (resolve, reject){
    //     if (userAlerts.find( (name) => name === alertDomainName)) {
    //       reject("User alert already exists");
    //     } else {
    //       userAlerts.push(alertDomainName);
    //       chrome.storage.sync.set({userAlerts: userAlerts}, function(){
    //         resolve();
    //       });
    //     }
    //   });
    // })

    // Check if we already have a domain record for this alert and
    // create/update the record with the alert status.
    // .then(getDomainRecords)
    // .then(function(domainRecords){
    //   return new Promise(function(resolve, reject){
    //     let matchingRecord = domainRecords.find(function(record){
    //       return record.domain === alertDomainName;
    //     });

    //     if (matchingRecord){
    //       matchingRecord.isAlert = true;
    //     } else {
    //       domainRecords.createDomainRecord(alertDomainName, {alert: true});
    //     }
    //   });
    // });
  // }

}
