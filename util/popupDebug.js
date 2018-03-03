class Debug {

  clear(){
    chrome.storage.sync.clear();
    console.log('Storage cleared');
  }

  deleteDomain(domain){
    chrome.storage.sync.get('domainRecords', function(res){
      let domainRecords = res.domainRecords;
      let domainObj = domainRecords.find((record) => record.name === domain);
      domainRecords = domainRecords.splice(domainRecords.indexOf(domainObj), 1);

      chrome.storage.sync.set({domainRecords: domainRecords}, function(){
        console.log(`${domain} removed from storage.`);
      });

    });
  }

  deleteUserAlert(alert){
    chrome.storage.sync.get('userAlerts', function(res){
      let userAlerts = res.userAlerts;
      userAlerts = userAlerts.splice(userAlerts.indexOf(alert), 1);

      chrome.storage.sync.set({userAlerts: userAlerts}, function(){
        console.log(`${alert} removed from storage.`);
      });

    });
  }

  clearUserAlerts(){
    chrome.storage.sync.set({userAlerts: []}, function(){
      console.log('All user alerts cleared');
    });
  }

  listDomains(){
    chrome.storage.sync.get('domainRecords', (result) => console.log(result.domainRecords));
  }

  listUserAlerts(){
    chrome.storage.sync.get('userAlerts', (result) => console.log(result.userAlerts));
  }
}

window.d = new Debug();
