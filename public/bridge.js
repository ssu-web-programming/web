function getAgentPlatform(userAgent) {
  if (userAgent) {
    let ua = userAgent.toLowerCase();

    if (ua.search('android') > -1) {
      return 'android';
    } else if (ua.search('iphone') > -1 || ua.search('ipod') > -1 || ua.search('ipad') > -1) {
      return 'ios';
    } else if (ua.search('macintosh') > -1) {
      return 'mac';
    } else if (ua.search('win') > -1) {
      return 'pc';
    }
  }

  return 'unkwon';
}

const getPlatform = () => {
  return getAgentPlatform(navigator.userAgent);
};

async function imageToString(img) {
  return new Promise((resolve, reject) => {
    try {
      let reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(img);
    } catch (err) {
      throw err;
    }
  });
}

const getDelegator = (call) => {
  try {
    const platform = getPlatform();
    switch (platform) {
      case 'android': {
        return window.Native[call];
      }
      case 'ios':
      case 'mac': {
        return window.webkit.messageHandlers[call].postMessage;
      }
      // case 'pc': {
      //   window.chrome.webview.postMessage(msg);
      //   break;
      // }
      // case 'web': {
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
      const deletor = getDelegator('insertText');
      deletor(text);
    } catch (err) {
      console.log(err);
    }
  },

  insertHtml: (html) => {
    try {
      const deletor = getDelegator('insertHtml');
      deletor(html);
    } catch (err) {
      console.log(err);
    }
  },

  downloadImage: async (img) => {
    try {
      const text = await imageToString(img);
      const deletor = getDelegator('downloadImage');
      deletor(text);
    } catch (err) {
      console.log(err);
    }
  },

  insertImage: async (img) => {
    try {
      const text = await imageToString(img);
      const deletor = getDelegator('insertImage');
      deletor(text);
    } catch (err) {
      console.log(err);
    }
  },

  closePanel: (history) => {
    try {
      const deletor = getDelegator('closePanel');
      deletor(history);
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
