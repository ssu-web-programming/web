const UA_PREFIX = `__polaris_office_ai_`;

const CLIENT_TYPE = {
  UNKNOWN: 'unknown',
  ANDROID: 'android',
  IOS: 'ios',
  MAC: 'mac',
  WINDOWS: 'windows',
  WEB: 'web'
};
// const CLIENT_TYPE = {
//   UNKNOWN: 'unknown',
//   ANDROID: 'android',
//   IOS: 'ios',
//   MAC: 'mac',
//   WINDOWS: 'windows',
//   WEB: 'web'
// };

// function getAgentPlatform(userAgent) {
//   if (userAgent) {
//     let ua = userAgent.toLowerCase();

//     if (ua.search('android') > -1) {
//       return CLIENT_TYPE.ANDROID;
//     } else if (ua.search('iphone') > -1 || ua.search('ipod') > -1 || ua.search('ipad') > -1) {
//       return CLIENT_TYPE.IOS;
//     } else if (ua.search('macintosh') > -1) {
//       return CLIENT_TYPE.MAC;
//     } else if (ua.search('win') > -1) {
//       return CLIENT_TYPE.WINDOWS;
//     }
//   }

//   return CLIENT_TYPE.UNKNOWN;
// }

const BridgeList = {};

function getAgentPlatform(userAgent) {
  if (userAgent) {
    let ua = userAgent.toLowerCase();

    if (ua.search(`${UA_PREFIX}${CLIENT_TYPE.ANDROID}`) > -1) {
      return CLIENT_TYPE.ANDROID;
    } else if (ua.search(`${UA_PREFIX}${CLIENT_TYPE.IOS}`) > -1) {
      return CLIENT_TYPE.IOS;
    } else if (ua.search(`${UA_PREFIX}${CLIENT_TYPE.MAC}`) > -1) {
      return CLIENT_TYPE.MAC;
    } else if (ua.search(`${UA_PREFIX}${CLIENT_TYPE.WINDOWS}`) > -1) {
      return CLIENT_TYPE.WINDOWS;
    } else if (ua.search(`${UA_PREFIX}${CLIENT_TYPE.WEB}`) > -1) {
      return CLIENT_TYPE.WEB;
    }
  }

  return CLIENT_TYPE.UNKNOWN;
}

const getPlatform = () => {
  return getAgentPlatform(navigator.userAgent);
};

async function fileToString(file) {
  return new Promise((resolve, reject) => {
    try {
      let reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      throw err;
    }
  });
}

const getDelegator = (api, arg) => {
  return () => {
    try {
      const platform = getPlatform();
      switch (platform) {
        case CLIENT_TYPE.ANDROID: {
          return window.Native[api](arg);
        }
        case CLIENT_TYPE.IOS:
        case CLIENT_TYPE.MAC: {
          switch (api) {
            case 'initComplete': {
              return window.webkit.messageHandlers.initComplete.postMessage(arg);
            }
            case 'insertText': {
              return window.webkit.messageHandlers.insertText.postMessage(arg);
            }
            case 'insertHtml': {
              return window.webkit.messageHandlers.insertHtml.postMessage(arg);
            }
            case 'downloadImage': {
              return window.webkit.messageHandlers.downloadImage.postMessage(arg);
            }
            case 'insertImage': {
              return window.webkit.messageHandlers.insertImage.postMessage(arg);
            }
            case 'openWindow': {
              return window.webkit.messageHandlers.openWindow.postMessage(arg);
            }
            case 'openDoc': {
              return window.webkit.messageHandlers.openDoc.postMessage(arg);
            }
            case 'closePanel': {
              return window.webkit.messageHandlers.closePanel.postMessage(arg);
            }
            case 'getSessionInfo': {
              return window.webkit.messageHandlers.getSessionInfo.postMessage(arg);
            }
            default: {
              throw new Error(`unknown handler name : ${api}`);
            }
          }
        }
        case CLIENT_TYPE.WINDOWS: {
          const msg = arg ? `${api} ${arg}` : api;
          return window.chrome.webview.postMessage(msg);
        }
        case CLIENT_TYPE.WEB:
        default: {
          if (!window || !window.parent || !window.parent.postMessage) {
            throw new Error(`unknown platform : ${platform}`);
          }
          return window.parent.postMessage(JSON.stringify({ api, arg }), '*');
        }
      }
    } catch (err) {}
  };
};

window._Bridge = {
  checkSession: (api) => {
    return new Promise((resolve, reject) => {
      const callback = async (sessionInfo, id) => {
        try {
          const { body } = sessionInfo;
          const res = await fetch('/api/v2/user/getCurrentLoginStatus', {
            headers: {
              'content-type': 'application/json',
              'X-PO-AI-MayFlower-Auth-AID': body['AID'],
              'X-PO-AI-MayFlower-Auth-BID': body['BID'],
              'X-PO-AI-MayFlower-Auth-SID': body['SID'],
              'User-Agent': navigator.userAgent
            },
            method: 'GET'
          });
          const resJson = await res.json();
          if (resJson?.success === false) {
            reject({
              success: false
            });
          } else {
            resolve({
              success: true,
              sessionInfo: { AID: body['AID'], BID: body['BID'], SID: body['SID'] }
            });
          }
        } catch (err) {
          reject({ success: false, err });
        } finally {
          delete BridgeList[id];
        }
      };
      try {
        const item = {
          id: `${api}_${Date.now()}`,
          callback
        };
        BridgeList[item.id] = item;

        const delegator = getDelegator('getSessionInfo', item.id);
        delegator();
      } catch (err) {
        reject(err);
      }
    });
  },

  initComplete: () => {
    try {
      const delegator = getDelegator('initComplete');
      delegator();
    } catch (err) {}
  },

  insertText: (text) => {
    try {
      const delegator = getDelegator('insertText', text);
      delegator();
    } catch (err) {}
  },

  insertHtml: (html) => {
    try {
      const delegator = getDelegator('insertHtml', html);
      delegator();
    } catch (err) {}
  },

  downloadImage: async (img) => {
    try {
      const text = await fileToString(img);
      const delegator = getDelegator('downloadImage', text);
      delegator();
    } catch (err) {}
  },

  insertImage: async (img) => {
    try {
      const text = await fileToString(img);
      const delegator = getDelegator('insertImage', text);
      delegator();
    } catch (err) {}
  },

  openWindow: (target) => {
    try {
      const delegator = getDelegator('openWindow', target);
      delegator();
    } catch (err) {}
  },

  openDoc: async (doc) => {
    try {
      const text = await fileToString(doc);
      const delegator = getDelegator('openDoc', text);
      delegator();
    } catch (err) {}
  },

  closePanel: (history) => {
    try {
      const delegator = getDelegator('closePanel', history);
      delegator();
    } catch (err) {}
  }
};

function callbackMessage(msg) {
  try {
    const id = msg.cmdID;
    if (BridgeList[id]) {
      const item = BridgeList[id];
      if (item && item.callback) {
        item.callback(msg, id);
      }
    }
  } catch (err) {}
}

function receiveMessage(msg) {
  document.dispatchEvent(
    new CustomEvent('CustomBridgeEvent', {
      detail: msg
    })
  );
}

window.addEventListener('message', (msg) => {
  try {
    callbackMessage(msg.data);
  } catch (err) {}
});
