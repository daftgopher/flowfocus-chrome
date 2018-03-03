const chrome = window.chrome;

// import { DomainRecords } from 'Util/domainUtil';
// const domainRecords = new DomainRecords();

export default class UserAlert {

  get(){
    return new Promise(function(resolve, reject){
      chrome.storage.sync.get('userAlerts', function(result){
        return result.userAlerts || [];
      }, (err) => reject(err));
    });
  }

  // create(alertDomainName){
    // Check if the user has already entered this alert



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
