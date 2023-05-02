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

const getDelegator = (call) => {
  try {
    const platform = getPlatform();
    switch (platform) {
      case CLIENT_TYPE.ANDROID: {
        return window.Native[call];
      }
      case CLIENT_TYPE.IOS:
      case CLIENT_TYPE.MAC: {
        return window.webkit.messageHandlers[call].postMessage;
      }
      // case CLIENT_TYPE.PC: {
      //   window.chrome.webview.postMessage(msg);
      //   break;
      // }
      // case CLIENT_TYPE.WEB: {
      //   break;
      // }
      default: {
        throw new Error(`unknown platform : ${platform}`);
      }
    }
  } catch (err) {
    throw err;
  }
};

window._Bridge = {
  insertText: (text) => {
    try {
      const delegator = getDelegator('insertText');
      delegator(text);
    } catch (err) {
      console.log(err);
    }
  },

  insertHtml: (html) => {
    try {
      const delegator = getDelegator('insertHtml');
      delegator(html);
    } catch (err) {
      console.log(err);
    }
  },

  downloadImage: async (img) => {
    try {
      const text = await fileToString(img);
      const delegator = getDelegator('downloadImage');
      delegator(text);
    } catch (err) {
      console.log(err);
    }
  },

  insertImage: async (img) => {
    try {
      const text = await fileToString(img);
      const delegator = getDelegator('insertImage');
      delegator(text);
    } catch (err) {
      console.log(err);
    }
  },

  insertDoc: async (doc) => {
    try {
      const text = await fileToString(doc);
      const delegator = getDelegator('insertDoc');
      delegator(text);
    } catch (err) {
      console.log(err);
    }
  },

  closePanel: (history) => {
    try {
      const delegator = getDelegator('closePanel');
      delegator(history);
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
