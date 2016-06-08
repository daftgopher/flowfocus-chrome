/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	// function getTabDomain(){
	// 	return new Promise(function(resolve, reject){
	// 		chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
	// 			resolve( extractDomain(tabs[0].url) );
	// 		});
	// 	});
	// }

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var runtime = chrome.runtime;

	function checkDate() {
		return new Promise(function (resolve, reject) {

			var storage = chrome.storage.sync;

			storage.get('lastDate', function (result) {
				if (runtime.lastError) {
					reject(runtime.lastError);
				} else {
					var currentDate = new Date().toDateString();
					if (currentDate !== result.lastDate) {
						storage.set({ lastDate: currentDate }, function () {
							if (runtime.lastError) {
								reject(runtime.lastError);
							} else {
								// Purge data if the date has changed
								storage.set({ domainRecords: [] }, function () {
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

	var Debug = function () {
		function Debug() {
			_classCallCheck(this, Debug);
		}

		_createClass(Debug, [{
			key: 'clear',
			value: function clear() {
				chrome.storage.sync.clear();
				console.log('Storage cleared');
			}
		}, {
			key: 'deleteDomain',
			value: function deleteDomain(domain) {
				chrome.storage.sync.get('domainRecords', function (res) {
					var domainRecords = res.domainRecords;
					var domainObj = domainRecords.find(function (record) {
						return record.name === domain;
					});
					domainRecords = domainRecords.splice(domainRecords.indexOf(domainObj), 1);

					chrome.storage.sync.set({ domainRecords: domainRecords }, function () {
						console.log(domain + ' removed from storage.');
					});
				});
			}
		}, {
			key: 'listDomains',
			value: function listDomains() {
				chrome.storage.sync.get('domainRecords', function (result) {
					return console.log(result.domainRecords);
				});
			}
		}, {
			key: 'listUserAlerts',
			value: function listUserAlerts() {
				chrome.storage.sync.get('userAlerts', function (result) {
					return console.log(result.userAlerts);
				});
			}
		}]);

		return Debug;
	}();

	window.d = new Debug();

	function extractDomain(url) {

		// Really cool way to extract domains from URLs - get the
		// 'hostname' property from an <a> element we'll create and give
		// an href attribute.
		var a = document.createElement('a');
		a.href = url;

		// Strip subdomain and return
		return a.hostname.split('.').slice(-2).join('.');
	}

	function createNotification(domain, message) {

		var overageMessages = { // Maybe convert this to a Map?
			three: {
				type: 'basic',
				iconUrl: 'images/notifications.png',
				title: 'Third Time\'s Lost Its Charm...',
				message: 'Heads up, you\'ve visited ' + domain + ' 3 times today already. Stay focused, friend!'
			},

			six: {
				type: 'basic',
				iconUrl: 'images/notifications.png',
				title: 'Six Times Now, Dude',
				message: 'Careful now, you\'ve now visited ' + domain + ' 6 times today. Close the tab and get back on task!'
			}
		};

		chrome.notifications.create(undefined, overageMessages[message]);
	}

	var storage = chrome.storage.sync;

	function updateUrlCount(url) {

		storage.get('domainRecords', function (result) {
			var domainRecords = result.domainRecords || [];
			var domainRecord = domainRecords.find(function (record) {
				return record.domain === url;
			});
			if (domainRecord) {
				var domainRecordIndex = domainRecords.indexOf(domainRecords);
				// Update the count
				domainRecord.count = domainRecord.count ? ++domainRecord.count : 1;

				// Replace the object in the array and save it
				domainRecords[domainRecordIndex] = domainRecord;

				// Alert the user if they're supposed to be avoiding this domain
				storage.get('userAlerts', function (res) {
					var userAlerts = res.userAlerts;

					// Check if the domain is in the list of watched domains
					if (userAlerts.indexOf(domainRecord.domain) !== -1) {
						if (domainRecord.count === 3) {
							createNotification(url, 'three');
						} else if (domainRecord.count === 6) {
							createNotification(url, 'six');
						}
					}
				});
			} else {
				// Create the new record
				domainRecord = { domain: url, count: 1 };
				domainRecords.push(domainRecord);
			}

			storage.set({ domainRecords: domainRecords }, function () {
				console.log(domainRecords);
			});
		});
	}

	function getDomainRecords() {
		return new Promise(function (resolve, reject) {
			chrome.storage.sync.get('domainRecords', function (result) {
				return result.domainRecords || [];
			});
		});
	}

	function createDomainRecord() {
		var record = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		return new Promise(function (resolve, reject) {
			getDomainRecords().then(function (domainRecords) {
				// Assign new id by incrementing last id number
				record.id = domainRecords[domainRecords.length - 1].id++ || 1;
				domainRecords.push(record);
				chrome.storage.set({ domainRecords: domainRecords }, function () {
					resolve(domainRecords);
				});
			});
		});
	}

	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
		if (changeInfo.url) {
			(function () {
				var domain = extractDomain(tab.url);
				chrome.storage.sync.get('lastDomain', function (result) {
					if (!result) {
						return;
					}
					var lastDomain = result.lastDomain;
					if (domain !== lastDomain) {
						chrome.storage.sync.set({ lastDomain: domain }, function () {
							checkDate().then(function () {
								if (domain !== 'newtab') {
									updateUrlCount(domain);
								}
							});
						});
					}
				});
			})();
		}
	});

/***/ }
/******/ ]);