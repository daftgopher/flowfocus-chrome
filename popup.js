"use strict"

function extractDomain(url){
	// Really cool way to extract domains from URLs 
	// taken from http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string#answer-8498668
	let a = document.createElement('a');
	a.href = url;
	// Strip subdomain (or www.) and return
	return a.hostname.split('.').slice(-2).join('.');
}

function getActiveTabDomain(){
	return new Promise(function(resolve, reject){
		chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
			resolve( extractDomain(tabs[0].url) );
		});
	});
}

document.addEventListener('DOMContentLoaded', function(){
	let status = document.getElementById('status');
	let counterNode = document.getElementById('counter');
	let rowsNode = document.getElementById('dataTable-rows');
	let storage = chrome.storage.sync;

	// DOM Elements
	let mainEl = document.getElementById('main');
	let formEl = document.getElementById('form');
	let domainListEl = document.getElementById('domain-list');
	let buttonEl = document.getElementById('add-alert');
	let alertMessageEl = document.getElementById('alert-message');

	// Query for these once the form is visible
	let inputEl; 
	let errorMessageEl;

	// When the popup first opens, there are weird issues with the 
	// total width of the element. We need to wait until the popup is
	// fully displayed before showing the (offscreen) form element. 
	window.setTimeout(function(){
		mainEl.classList.remove('loading');
		formEl.classList.remove('hidden');
		inputEl = document.getElementById('alert-input');
		errorMessageEl = document.getElementById('error-text');
	}, 1500);


	function activateForm(event){
		event.preventDefault();
		mainEl.addEventListener("transitionend", function(){
			buttonEl.setFormStateListener();
			inputEl.focus();	
		});
		mainEl.classList.add('formActive');
	}

	function deactivateForm(event){
		event.preventDefault();
	}

	function confirmSuccess(domain){
		buttonEl.removeAttribute('disabled');
		inputEl.value = "";
		buttonEl.textContent = "Submit";
		alertMessageEl.textContent = `${domain} added to distraction alerts!`
		alertMessageEl.classList.add('active');

		window.setTimeout(function(){
			alertMessageEl.classList.remove('active');
		}, 4000)
	}

	function submitForm(data){
		// return new Promise(function(resolve, reject){
		// 	storage.get('userAlerts', (result) => {
		// 		let userAlerts = result.userAlerts || [];
		// 		userAlerts.push(data);
		// 		storage.set({userAlerts: userAlerts}, function(){
		// 			resolve(data);
		// 		});
		// 	});
		// });
		setNewUserAlert(data);
	}

	buttonEl.setListStateListener = () => {
		this.removeEventListener('click', deactivateForm);
		this.addEventListener('click', activateForm);
	};

	buttonEl.setFormStateListener = function(){
		this.textContent = "Submit";
		this.removeEventListener('click', activateForm);
		this.addEventListener('click', function(event){
			event.preventDefault();
			if ( inputEl.value ) { // Form is Valid
				errorMessageEl.classList.remove('is-active');
				errorMessageEl.textContent = "";
				buttonEl.setAttribute('disabled', 'disabled');
				buttonEl.textContent = 'Submitting...';

				// TODO: Need to extract the domain from the submitted value
				submitForm(inputEl.value).then(confirmSuccess);
			} else {
				errorMessageEl.classList.add('is-active');
				errorMessageEl.textContent = "Please enter a website";
			};

		});
	};

	buttonEl.setListStateListener();


	storage.get('lastDomain', function(result){
		getActiveTabDomain().then(function(domain){
			status.textContent = `Currently visiting: ${domain}`;

			storage.get('domainRecords', (result) => {

				if (result.domainRecords.length) {

					// Set up the table
					let domainRecords = result.domainRecords;
					let tableHtml = '';

					// Sort table in descending order by visit count
					domainRecords.sort(function(a,b){
						if (a.count < b.count){
							return -1;
						} else if (a.count > b.count) {
							return 1;
						} else {
							return 0;
						}
					}).reverse()

					for(let record of domainRecords){
						tableHtml += 
						`<tr>
							<td>${record.domain}</td>
							<td>${record.count}</td>
						</tr>`
					}
					rowsNode.innerHTML = tableHtml;

					// Show the current domain and times visited
					let currentDomain = domainRecords.find((record) => record.domain === domain);

					// If a tab was left open after the count is reset (when the date rolls over),
					// the value will be undefined so we'll set a default count of 0
					currentDomain = currentDomain || {count: 0}; 
					counterNode.textContent = `You've visited this site ${currentDomain.count} ${currentDomain.count === 1 ? 'time' : 'times'} today.`;
				}

			});
		});
	});
});

function getData(str){
	return new Promise(function(resolve, reject){
		chrome.strorage.sync.get(str, function(result){
			resolve(result[str]);
		})
	});
}

function setData(obj){
	return new Promise(function(resolve, reject){
		chrome.strorage.sync.set(obj, function(result){
			resolve(obj);
		})
	});
}

function getDomainRecords(){
	return new Promise(function(resolve, reject){
		chrome.storage.sync.get('domainRecords', function(result){
			return result.domainRecords || [];
		});
	});
}

function createDomainRecord(domainName, options = {}){
	return new Promise(function(resolve, reject){
		getDomainRecords()
		.then(function(domainRecords){
			// Assign new id by incrementing last id number
			let record = {
				id: domainRecords[domainRecords.length - 1].id++ || 1,
				count: 1,
				domain: domainName,
				alert: !!options.alert
			}
			domainRecords.push(record);
			chrome.storage.set({domainRecords: domainRecords}, function(){
				resolve(domainRecords);
			});
		});
	});
}

function updateDomainRecord(domain){
	return new Promise(function(resolve, reject){
		getDomainRecords()
		  .then(function(domainRecords){

		  });
	});
}

function getUserAlerts(){
	return new Promise(function(resolve, reject){
		chrome.storage.sync.get('userAlerts', function(result){
			return result.userAlerts || [];
		});
	});
}

function setNewUserAlert(alertDomainName){
	// Check if the user has already entered this alert
	getUserAlerts()
	.then(function(userAlerts){
		return new Promise(function (resolve, reject){
			if (userAlerts.find( (name) => name === alertDomainName)) {
				reject("User alert already exists");
			} else {
				userAlerts.push(alertDomainName);
				chrome.storage.sync.set({userAlerts: userAlerts}, function(){
					resolve();
				});
			}
		});
	})

	// Check if we already have a domain record for this alert and
	// create/update the record with the alert status.
	.then(getDomainRecords)
	.then(function(domainRecords){
		return new Promise(function(resolve, reject){
			let matchingRecord = domainRecords.find(function(record){
				return record.domain === alertDomainName;
			});

			if (matchingRecord){
				matchingRecord.isAlert = true;
			} else {
				createDomainRecord(alertDomainName, {alert: true});
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
			let domainRecords = res.domainRecords;
			let domainObj = domainRecords.find((record) => record.name === domain)
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
			console.log("All user alerts cleared");
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