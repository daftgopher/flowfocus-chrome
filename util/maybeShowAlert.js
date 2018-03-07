import uuidV4 from 'uuid/v4';

// Alert suggestions
const chrome = window.chrome;
function maybeShowAlert(domainObj){
  if (domainObj.hasAlert) {
    if (domainObj.count === 3){
      chrome.notifications.create(uuidV4(), {
        type: 'basic',
        iconUrl: 'images/logo_icon.png',
        title: 'FlowFocus Alert',
        message: `Heads up! This is your 3rd visit to ${domainObj.domain} today.`
      });
    } else if (domainObj.count === 7){
      chrome.notifications.create(uuidV4(), {
        type: 'basic',
        iconUrl: 'images/logo_icon.png',
        title: 'FlowFocus Alert',
        message: `FYI -- This is already the 7th time you've checked ${domainObj.domain} today.`
      });
    } else if (domainObj.count >= 10) {
      chrome.notifications.create(uuidV4(), {
        type: 'basic',
        iconUrl: 'images/logo_icon.png',
        title: 'FlowFocus Alert',
        message: `You've visited ${domainObj.domain} ${domainObj.count} times today.`
      });
    }
  } else if ((domainObj.count % 8 === 0) && domainObj.count < 25) {
    chrome.notifications.create(uuidV4(), {
      type: 'basic',
      iconUrl: 'images/logo_icon.png',
      title: `${domainObj.count} is enough`,
      message: `Heads up! You've visited ${domainObj.domain} ${domainObj.count} times today. You may want to set a distraction alert for it.`
    });
  }
}

export default maybeShowAlert;
