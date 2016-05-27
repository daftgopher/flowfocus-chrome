"use strict"

// function getTabDomain(){
// 	return new Promise(function(resolve, reject){
// 		chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
// 			resolve( extractDomain(tabs[0].url) );
// 		});
// 	});
// }

let runtime = chrome.runtime;

function checkDate(){
	return new Promise(function(resolve, reject){
		
		const storage = chrome.storage.sync;

		storage.get('lastDate', function(result){
			if (runtime.lastError) {
				reject(runtime.lastError)
			} else {
				let currentDate = new Date().toDateString();
				if (currentDate !== result.lastDate) {
					storage.set({lastDate: currentDate}, function(){
						if (runtime.lastError){
							reject(runtime.lastError)
						} else {
							// Purge data if the date has changed
							storage.set({domainRecords: [] }, function(){
								console.log('Domain count purged');
								resolve(true);
							});
						}
						console.log("Date Updated");
					});
				} else {
					resolve(true);
				}
			}
		});

	});
}


class Debug {

	clear(){
		chrome.storage.sync.clear();
		console.log('Storage cleared');
	}

	deleteDomain(domain){
		chrome.storage.sync.get('domainRecords', function(res){
			let domainCounts = res.domainCounts;
			let domainObj = domainCounts.find((record) => record.name === domain)
			domainCounts = domainCounts.splice(domainCounts.indexOf(domainObj), 1);
			
			chrome.storage.sync.set({domainCounts: domainCounts}, function(){
				console.log(`${domain} removed from storage.`);
			});

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

function extractDomain(url){
	
	// Really cool way to extract domains from URLs - get the
	// 'hostname' property from an <a> element we'll create and give
	// an href attribute.
	let a = document.createElement('a');
	a.href = url;

	// Strip subdomain and return
	return a.hostname.split('.').slice(-2).join('.');
}

function createNotification(domain, message){

	const overageMessages = { // Maybe convert this to a Map?
		three: {
			type: 'basic',
			iconUrl: 'images/notifications.png',
			title: 'Third Time\'s Lost Its Charm...',
			message: `Heads up, you've visited ${domain} 3 times today already. Stay focused, friend!`
		},

		six: {
			type: 'basic',
			iconUrl: 'images/notifications.png',
			title: 'Six Times Now, Dude',
			message: `Careful now, you've now visited ${domain} 6 times today. Close the tab and get back on task!`
		}
	};

	chrome.notifications.create(undefined, overageMessages[message]);
}

let storage = chrome.storage.sync;

function updateUrlCount(url){

	storage.get('domainRecords', function(result){
		let domainRecords = result.domainRecords || [];
		let domainRecord = domainRecords.find( (record) => record.domain === url );
		if (domainRecord){
			let domainRecordIndex = domainRecords.indexOf(domainRecords);
			// Update the count
			domainRecord.count = domainRecord.count ? ++domainRecord.count : 1;

			// Replace the object in the array and save it
			domainRecords[domainRecordIndex] = domainRecord

			// Alert the user if they're supposed to be avoiding this domain
			storage.get('userAlerts', function(res){
				let userAlerts = res.userAlerts;

				// Check if the domain is in the list of watched domains
				if (userAlerts.indexOf(domainRecord.domain) !== -1){
					if (domainRecord.count === 3){
						createNotification(url, 'three');
					} else if (domainRecord.count === 6){
						createNotification(url, 'six');
					}	
				}
				
			});
		} else {
			// Create the new record
			domainRecord = {domain: url, count: 1};
			domainRecords.push(domainRecord);
		}
		
		storage.set({domainRecords: domainRecords}, function(){
			console.log(domainRecords);
		})
	});

}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if (changeInfo.url){
		let domain = extractDomain(tab.url);
		chrome.storage.sync.get('lastDomain', function(result){
			if (!result) {
				return
			}
			let lastDomain = result.lastDomain;
			if (domain !== lastDomain) {
				chrome.storage.sync.set({lastDomain: domain}, function(){
					checkDate()
					.then(function(){
						if (domain !== 'newtab'){
							updateUrlCount(domain);
						}
					});
				});
			}
		});
	}
});