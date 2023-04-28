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

window._Bridge = {
  insertText: (contents) => {
    const platform = getPlatform();
    console.log(platform);
  }
};

// try {
//   const platform = getPlatform();
//   console.log(platform);
//   const msg = JSON.stringify(contents);
//   switch (platform) {
//     case 'android': {
//       window.Native.sendMessage(msg);
//       break;
//     }
//     case 'ios': {
//       window.webkit.messageHandlers.macosListener.postMessage(msg);
//       break;
//     }
//     case 'pc': {
//       window.chrome.webview.postMessage(msg);
//       break;
//     }
//     case 'web': {
//       break;
//     }
//     default: {
//       break;
//     }
//   }
// } catch (err) {
//   throw err;
// }
