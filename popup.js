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

function isDataPresent(obj){
	// Calling chrome.storage.get() returns an empty object if there is no data for the
	// retrieved value. Unfortunately, empty objects are truthy so the 
	// Object.keys(result).length below is basically a data presence check
	return !!Object.keys(obj).length;
}

document.addEventListener('DOMContentLoaded', function(){
	let status = document.getElementById('status');
	let counterNode = document.getElementById('counter');
	let rowsNode = document.getElementById('dataTable-rows');
	let storage = chrome.storage.sync;
	storage.get('lastDomain', function(result){
		getActiveTabDomain().then(function(domain){
			status.textContent = `Currently visiting: ${domain}`;

			storage.get('domainCounts', (result) => {

				if (!isDataPresent(result)) {return}

				let domains = result.domainCounts;

				domains[Symbol.iterator] = function(){
					let keys = Object.keys(this);
					let count = 0;
					let isDone = false;
					let next = () => {
						if (count >= keys.length){
							isDone = true;
						}
						let obj = {};
						let key = keys[count];
						obj[key] = this[keys[count++]]
						return {done: isDone, value: obj};
					}
					return { next }
				}

				let tableHtml = '';

				for(let obj of domains){
					let domain = Object.keys(obj)[0];
					tableHtml += 
					`<tr>
						<td>${domain}</td>
						<td>${obj[domain]}</td>
					</tr>`
				}
				rowsNode.innerHTML = tableHtml;

				let currentDomainCount = result.domainCounts[domain];
				counterNode.textContent = `You've currently visited this site ${currentDomainCount} ${currentDomainCount > 1 ? 'times' : 'time'} today.`;

			});
		});
	});
});