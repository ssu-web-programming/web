const CLIENT_TYPE = {
  UNKNOWN: 'unknown',
  ANDROID: 'android',
  IOS: 'ios',
  MAC: 'mac',
  PC: 'pc',
  WEB: 'web'
};

function getAgentPlatform(userAgent) {
  if (userAgent) {
    let ua = userAgent.toLowerCase();

    if (ua.search('android') > -1) {
      return CLIENT_TYPE.ANDROID;
    } else if (ua.search('iphone') > -1 || ua.search('ipod') > -1 || ua.search('ipad') > -1) {
      return CLIENT_TYPE.IOS;
    } else if (ua.search('macintosh') > -1) {
      return CLIENT_TYPE.MAC;
    } else if (ua.search('win') > -1) {
      return CLIENT_TYPE.PC;
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
          return window.webkit.messageHandlers[api].postMessage(arg);
        }
        case CLIENT_TYPE.PC: {
          return window.chrome.webview.postMessage(arg);
        }
        case CLIENT_TYPE.WEB: {
          return window.parent.postMessage(arg, 'https://kittyhawk.polarisoffice.com/');
        }
        default: {
          throw new Error(`unknown platform : ${platform}`);
        }
      }
    } catch (err) {
      throw err;
    }
  };
};

window._Bridge = {
  initComplete: () => {
    try {
      const delegator = getDelegator('initComplete');
      delegator();
    } catch (err) {
      console.log(err);
    }
  },

  insertText: (text) => {
    try {
      const delegator = getDelegator('insertText', text);
      delegator();
    } catch (err) {
      console.log(err);
    }
  },

  insertHtml: (html) => {
    try {
      const delegator = getDelegator('insertHtml', html);
      delegator();
    } catch (err) {
      console.log(err);
    }
  },

  downloadImage: async (img) => {
    try {
      const text = await fileToString(img);
      const delegator = getDelegator('downloadImage', text);
      delegator();
    } catch (err) {
      console.log(err);
    }
  },

  insertImage: async (img) => {
    try {
      const text = await fileToString(img);
      const delegator = getDelegator('insertImage', text);
      delegator();
    } catch (err) {
      console.log(err);
    }
  },

  openDoc: async (doc) => {
    try {
      const text = await fileToString(doc);
      const delegator = getDelegator('openDoc', text);
      delegator();
    } catch (err) {
      console.log(err);
    }
  },

  closePanel: (history) => {
    try {
      const delegator = getDelegator('closePanel', history);
      delegator();
    } catch (err) {
      console.log(err);
    }
  }
};

function receiveMessage(msg) {
  document.dispatchEvent(
    new CustomEvent('CustomBridgeEvent', {
      detail: msg
    })
  );
}
