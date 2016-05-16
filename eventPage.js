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
							storage.set({domainCounts: {} }, function(){
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
		chrome.storage.sync.get('domainCounts', function(res){
			let domainCounts = res.domainCounts;
			delete domainCounts[domain];
			chrome.storage.sync.set({domainCounts: domainCounts}, function(){
				console.log(`${domain} removed from storage.`);
			});

		});
	}

	listDomains(){
		chrome.storage.sync.get('domainCounts', (result) => console.log(result.domainCounts));
	}
}

window.d = new Debug();

function extractDomain(url){
	// Really cool way to extract domains from URLs 
	// taken from http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string#answer-8498668
	let a = document.createElement('a');
	a.href = url;
	// Strip subdomain (or www.) and return
	return a.hostname.split('.').slice(-2).join('.');
}

function isDataPresent(obj){
	// Calling chrome.storage.get() returns an empty object if there is no data for the
	// retrieved value. Unfortunately, empty objects are truthy so the 
	// Object.keys(result).length below is basically a data presence check
	return !!Object.keys(obj).length;
}

function createNotification(domain){
	chrome.notifications.create(undefined, {
		type: 'basic',
		iconUrl: 'images/notifications.png',
		title: 'Third Time\'s Not the Charm',
		message: `Heads up, you've visited ${domain} at least 3 times today. Stay focused, friend!`
	})
}

let storage = chrome.storage.sync;

function updateUrlCount(url){
	storage.get('domainCounts', function(result){
		let domainCounts = result.domainCounts || {};
		// Create the key/value pair for url/count and increment the count
		domainCounts[url] = domainCounts[url] ? ++domainCounts[url] : 1;
		if (domainCounts[url] === 3){
			createNotification(url);
		}
		storage.set({domainCounts: domainCounts}, function(){
			console.log(domainCounts);
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