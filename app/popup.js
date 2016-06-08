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
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	__webpack_require__(1);

	function extractDomain(url) {
		// Really cool way to extract domains from URLs
		// taken from http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string#answer-8498668
		var a = document.createElement('a');
		a.href = url;
		// Strip subdomain (or www.) and return
		return a.hostname.split('.').slice(-2).join('.');
	}

	function getActiveTabDomain() {
		return new Promise(function (resolve, reject) {
			chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
				resolve(extractDomain(tabs[0].url));
			});
		});
	}

	document.addEventListener('DOMContentLoaded', function () {
		var _this = this;

		var status = document.getElementById('status');
		var counterNode = document.getElementById('counter');
		var rowsNode = document.getElementById('dataTable-rows');
		var storage = chrome.storage.sync;

		// DOM Elements
		var mainEl = document.getElementById('main');
		var formEl = document.getElementById('form');
		var domainListEl = document.getElementById('domain-list');
		var buttonEl = document.getElementById('add-alert');
		var alertMessageEl = document.getElementById('alert-message');

		// Query for these once the form is visible
		var inputEl = void 0;
		var errorMessageEl = void 0;

		// When the popup first opens, there are weird issues with the
		// total width of the element. We need to wait until the popup is
		// fully displayed before showing the (offscreen) form element.
		window.setTimeout(function () {
			mainEl.classList.remove('loading');
			formEl.classList.remove('hidden');
			inputEl = document.getElementById('alert-input');
			errorMessageEl = document.getElementById('error-text');
		}, 1500);

		function activateForm(event) {
			event.preventDefault();
			mainEl.addEventListener("transitionend", function () {
				buttonEl.setFormStateListener();
				inputEl.focus();
			});
			mainEl.classList.add('formActive');
		}

		function deactivateForm(event) {
			event.preventDefault();
		}

		function confirmSuccess(domain) {
			buttonEl.removeAttribute('disabled');
			inputEl.value = "";
			buttonEl.textContent = "Submit";
			alertMessageEl.textContent = domain + ' added to distraction alerts!';
			alertMessageEl.classList.add('active');

			window.setTimeout(function () {
				alertMessageEl.classList.remove('active');
			}, 4000);
		}

		function submitForm(data) {
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

		buttonEl.setListStateListener = function () {
			_this.removeEventListener('click', deactivateForm);
			_this.addEventListener('click', activateForm);
		};

		buttonEl.setFormStateListener = function () {
			this.textContent = "Submit";
			this.removeEventListener('click', activateForm);
			this.addEventListener('click', function (event) {
				event.preventDefault();
				if (inputEl.value) {
					// Form is Valid
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

		storage.get('lastDomain', function (result) {
			getActiveTabDomain().then(function (domain) {
				status.textContent = 'Currently visiting: ' + domain;

				storage.get('domainRecords', function (result) {

					if (result.domainRecords.length) {

						// Set up the table
						var domainRecords = result.domainRecords;
						var tableHtml = '';

						// Sort table in descending order by visit count
						domainRecords.sort(function (a, b) {
							if (a.count < b.count) {
								return -1;
							} else if (a.count > b.count) {
								return 1;
							} else {
								return 0;
							}
						}).reverse();

						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = domainRecords[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var record = _step.value;

								tableHtml += '<tr>\n\t\t\t\t\t\t\t<td>' + record.domain + '</td>\n\t\t\t\t\t\t\t<td>' + record.count + '</td>\n\t\t\t\t\t\t</tr>';
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}

						rowsNode.innerHTML = tableHtml;

						// Show the current domain and times visited
						var currentDomain = domainRecords.find(function (record) {
							return record.domain === domain;
						});

						// If a tab was left open after the count is reset (when the date rolls over),
						// the value will be undefined so we'll set a default count of 0
						currentDomain = currentDomain || { count: 0 };
						counterNode.textContent = 'You\'ve visited this site ' + currentDomain.count + ' ' + (currentDomain.count === 1 ? 'time' : 'times') + ' today.';
					}
				});
			});
		});
	});

	function getData(str) {
		return new Promise(function (resolve, reject) {
			chrome.strorage.sync.get(str, function (result) {
				resolve(result[str]);
			});
		});
	}

	function setData(obj) {
		return new Promise(function (resolve, reject) {
			chrome.strorage.sync.set(obj, function (result) {
				resolve(obj);
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

	function createDomainRecord(domainName) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		return new Promise(function (resolve, reject) {
			getDomainRecords().then(function (domainRecords) {
				// Assign new id by incrementing last id number
				var record = {
					id: domainRecords[domainRecords.length - 1].id++ || 1,
					count: 1,
					domain: domainName,
					alert: !!options.alert
				};
				domainRecords.push(record);
				chrome.storage.set({ domainRecords: domainRecords }, function () {
					resolve(domainRecords);
				});
			});
		});
	}

	function updateDomainRecord(domain) {
		return new Promise(function (resolve, reject) {
			getDomainRecords().then(function (domainRecords) {});
		});
	}

	function getUserAlerts() {
		return new Promise(function (resolve, reject) {
			chrome.storage.sync.get('userAlerts', function (result) {
				return result.userAlerts || [];
			});
		});
	}

	function setNewUserAlert(alertDomainName) {
		// Check if the user has already entered this alert
		getUserAlerts().then(function (userAlerts) {
			return new Promise(function (resolve, reject) {
				if (userAlerts.find(function (name) {
					return name === alertDomainName;
				})) {
					reject("User alert already exists");
				} else {
					userAlerts.push(alertDomainName);
					chrome.storage.sync.set({ userAlerts: userAlerts }, function () {
						resolve();
					});
				}
			});
		})

		// Check if we already have a domain record for this alert and
		// create/update the record with the alert status.
		.then(getDomainRecords).then(function (domainRecords) {
			return new Promise(function (resolve, reject) {
				var matchingRecord = domainRecords.find(function (record) {
					return record.domain === alertDomainName;
				});

				if (matchingRecord) {
					matchingRecord.isAlert = true;
				} else {
					createDomainRecord(alertDomainName, { alert: true });
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
			key: 'deleteUserAlert',
			value: function deleteUserAlert(alert) {
				chrome.storage.sync.get('userAlerts', function (res) {
					var userAlerts = res.userAlerts;
					userAlerts = userAlerts.splice(userAlerts.indexOf(alert), 1);

					chrome.storage.sync.set({ userAlerts: userAlerts }, function () {
						console.log(alert + ' removed from storage.');
					});
				});
			}
		}, {
			key: 'clearUserAlerts',
			value: function clearUserAlerts() {
				chrome.storage.sync.set({ userAlerts: [] }, function () {
					console.log("All user alerts cleared");
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./popup.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./popup.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n  background-image: linear-gradient(to bottom, #88b67c, #4a903c);\n  border: 1px solid #fff;\n  color: #ffffff;\n  font-family: \"Segoe UI\", \"Lucida Grande\", Tahoma, sans-serif;\n  font-size: 14px;\n  max-width: 500px;\n  min-width: 400px;\n  margin: 0;\n  padding: 0; }\n\ntable {\n  border-collapse: collapse;\n  font-size: 0.7rem;\n  width: 100%; }\n\ntd {\n  border-bottom: 1px solid #007147;\n  padding: 5px; }\n\nth {\n  border-bottom: 2px solid #007147;\n  padding: 5px;\n  text-align: left; }\n\nmain {\n  display: flex;\n  max-height: 350px;\n  transition: all 0.6s ease;\n  width: 200%; }\n\nmain.loading {\n  width: initial; }\n\n.domainListing,\n.formWrapper {\n  flex: 1;\n  padding: 15px 25px;\n  transform: translate(0, 0);\n  min-height: 200px;\n  width: 500px; }\n\n.domainListing {\n  overflow-y: scroll; }\n\n.formActive {\n  overflow: hidden;\n  transform: translate(-50%, 0); }\n\n.formWrapper {\n  text-align: center; }\n\np {\n  text-align: center; }\n\n#status {\n  font-size: 1rem; }\n\np:first-child {\n  margin-top: 0; }\n\np:last-child {\n  margin-top: 0;\n  margin-bottom: 0; }\n\np.lead {\n  font-size: 16px;\n  line-height: 1.5;\n  margin-bottom: 25px; }\n\nheader {\n  background-image: linear-gradient(to bottom, #EFFFEA, #DAFFD1);\n  text-align: center;\n  padding: 10px 25px; }\n\nfooter {\n  background: #4C774C;\n  border-top: 1px solid #365836;\n  padding: 15px;\n  text-align: center; }\n\n.button--primary {\n  background: #DE6727;\n  border: none;\n  border-radius: 3px;\n  color: #fff;\n  font-family: \"Segoe UI\", \"Lucida Grande\", Tahoma, sans-serif;\n  font-size: 14px;\n  line-height: 2.5;\n  max-width: 200px;\n  transition: all 0.3s ease;\n  width: 250px; }\n\n.button--primary:hover {\n  background: #F1712D;\n  cursor: pointer; }\n\n.button--primary[disabled] {\n  background: #f3f3f3;\n  color: #aaa; }\n\n.hidden {\n  display: none !important; }\n\n.inputNote {\n  display: block;\n  line-height: 1.5; }\n\ninput[type='text'] {\n  border: none;\n  border-radius: 3px;\n  font-size: 14px;\n  line-height: 3;\n  margin-bottom: 25px;\n  padding: 0 10px;\n  width: 250px; }\n\n.error {\n  color: red;\n  font-size: 12px;\n  margin: -20px 0 15px;\n  opacity: 0;\n  transition: opacity 0.3s; }\n\n.error.is-active {\n  opacity: 1; }\n\n.alert-message {\n  background: orange;\n  border-bottom-left-radius: 7px;\n  border-bottom-right-radius: 7px;\n  color: #fff;\n  padding: 25px;\n  position: absolute;\n  text-align: center;\n  top: 0;\n  left: 0;\n  right: 0;\n  transition: all 0.6s ease;\n  transform: translate(0, -25vh);\n  z-index: 100; }\n\n.alert-message.active {\n  transform: translate(0, 0); }\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);