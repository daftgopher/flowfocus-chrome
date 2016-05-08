"use strict"

let counter = 0;

function getTabDomain(){
	return new Promise(function(resolve, reject){
		chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {

			function extractDomain(url){
				// Really cool way to extract domains from URLs 
				// taken from http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string#answer-8498668
				let a = document.createElement('a');
				a.href = url;
				return a.hostname;
			}

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
	let storage = chrome.storage.sync;

	// function getStorageVal(val = null){
	// 	return new Promise(function(resolve, reject){
	// 		storage.get(val, function(result){
	// 			resolve(result);
	// 		})
	// 	});
	// }

	function updateUrlCount(url){
		return new Promise(function(resolve, reject){
			storage.get(url, function(result){
				let data = {}
				
				// Create the key/value pair for url/count
				//
				// Checking if we've visited the site before and
				// incrementing the count if so.
				

				data[url] = isDataPresent(result) ? ++result[url] : 1;
				storage.set(data, function(){
					resolve(data);
				})
			});
		});
		// return new Promise(function(resolve, reject){
		// 	storage.set(val, function(){
		// 		resolve(val);
		// 	})
		// });
	}

	getTabDomain()
	 .then(updateUrlCount)
	 .then(function(data){
	 		let url = Object.keys(data)[0];
			status.textContent = `Hey, you're currenlty visiting ${url}`;
			counterNode.textContent = `You've currently visited this site ${data[url]} ${data[url] > 1 ? 'times' : 'time'}`
		})
	 .catch(function(error){
			status.textContent = `Oh whoops, there was an error: ${error}`
	  	});

});