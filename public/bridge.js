const getPlatform = () => {
  return navigator.userAgent;
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
