const chrome = window.chrome;
const storageArea = chrome.storage.sync;

export const PromiseStorage = {
  get: (keys) => {
    return new Promise((resolve, reject) => {
      storageArea.get(keys, (res) => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  set: (obj) => {
    return new Promise((resolve, reject) => {
      storageArea.set(obj, () => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          // Return the storage area
          storageArea.get(null, (res) => resolve(res));
        }
      });
    });
  },
  clear: () => {
    return new Promise((resolve, reject) => {
      storageArea.clear(() => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          // Return the storage area
          storageArea.get(null, (res) => resolve(res));
        }
      });
    });
  }
};
