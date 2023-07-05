const UA_PREFIX: string = `__polaris_office_ai_`;

enum ClientType {
  unknown = 'unknown',
  android = 'android',
  ios = 'ios',
  mac = 'mac',
  windows = 'windows',
  web = 'web'
}

function getAgentPlatform(userAgent: string) {
  if (userAgent) {
    let ua = userAgent.toLowerCase();

    const platform = Object.values(ClientType).find(
      (type) => ua.search(`${UA_PREFIX}${type}`) > -1
    );

    if (platform) return platform;
  }
  return ClientType.unknown;
}

const getPlatform = () => getAgentPlatform(navigator.userAgent);

async function fileToString(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    try {
      let reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result) {
          resolve(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      throw err;
    }
  });
}

const callApi = (api: ApiType, arg?: string) => {
  try {
    const platform = getPlatform();
    switch (platform) {
      case ClientType.android: {
        window.Native[api](arg);
        break;
      }
      case ClientType.ios:
      case ClientType.mac: {
        switch (api) {
          case 'initComplete': {
            window.webkit.messageHandlers.initComplete.postMessage(arg);
            break;
          }
          case 'insertText': {
            window.webkit.messageHandlers.insertText.postMessage(arg);
            break;
          }
          case 'insertHtml': {
            window.webkit.messageHandlers.insertHtml.postMessage(arg);
            break;
          }
          case 'downloadImage': {
            window.webkit.messageHandlers.downloadImage.postMessage(arg);
            break;
          }
          case 'insertImage': {
            window.webkit.messageHandlers.insertImage.postMessage(arg);
            break;
          }
          case 'openWindow': {
            window.webkit.messageHandlers.openWindow.postMessage(arg);
            break;
          }
          case 'openDoc': {
            window.webkit.messageHandlers.openDoc.postMessage(arg);
            break;
          }
          case 'closePanel': {
            window.webkit.messageHandlers.closePanel.postMessage(arg);
            break;
          }
          case 'getSessionInfo': {
            window.webkit.messageHandlers.getSessionInfo.postMessage(arg);
            break;
          }
        }
        break;
      }
      case ClientType.windows: {
        const msg = arg ? `${api} ${arg}` : api;
        window.chrome.webview.postMessage(msg);
        break;
      }
      case ClientType.web:
      default: {
        if (!window || !window.parent || !window.parent.postMessage) {
          throw new Error(`unknown platform : ${platform}`);
        }
        window.parent.postMessage(JSON.stringify({ api, arg }), '*');
        break;
      }
    }
  } catch (err) {}
};

type BridgeItemID = string;
interface BridgeItem {
  id: BridgeItemID;
  callback: Function;
}

const BridgeList: { [id: BridgeItemID]: BridgeItem } = {};

declare global {
  interface Window {
    callbackMessage: (msg: CallbackMessage) => void;
    receiveMessage: (msg: ReceiveMessage) => void;
  }
}

// TODO : def body type
interface CallbackMessage {
  cmdID: BridgeItemID;
  body: any;
}

interface ReceiveMessage {
  cmd: string;
  body: string;
}

export const initBridgeListener = () => {
  window.callbackMessage = (msg: CallbackMessage) => {
    try {
      const id = msg.cmdID;
      if (BridgeList[id]) {
        const item = BridgeList[id];
        if (item && item.callback) {
          item.callback(msg, id);
        }
      }
    } catch (err) {}
  };
  window.receiveMessage = (msg: ReceiveMessage) => {
    document.dispatchEvent(
      new CustomEvent('CustomBridgeEvent', {
        detail: msg
      })
    );
  };

  window.addEventListener('message', (msg) => {
    try {
      window.callbackMessage(msg.data);
    } catch (err) {}
  });
};

interface CheckSessionResponse {
  success: boolean;
  sessionInfo: {
    AID: string;
    BID: string;
    SID: string;
  };
  userInfo: {
    us: string;
    uid: string;
    ul: string;
  };
}

type ApiType =
  | 'initComplete'
  | 'insertText'
  | 'insertHtml'
  | 'downloadImage'
  | 'insertImage'
  | 'openWindow'
  | 'openDoc'
  | 'closePanel'
  | 'getSessionInfo';

const Bridge = {
  checkSession: (api: string) => {
    return new Promise<CheckSessionResponse>((resolve, reject) => {
      const callback = async (sessionInfo: CallbackMessage, id: BridgeItemID) => {
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
            const { status, userId, level } = resJson.data.userInfo;
            resolve({
              success: true,
              sessionInfo: { AID: body['AID'], BID: body['BID'], SID: body['SID'] },
              userInfo: {
                us: status,
                uid: userId,
                ul: level.toString()
              }
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

        callApi('getSessionInfo', item.id);
      } catch (err) {
        reject({ success: false, err });
      }
    });
  },

  callBridgeApi: async (api: ApiType, arg?: string | Blob) => {
    const apiArg = arg && typeof arg !== 'string' ? await fileToString(arg) : arg;
    callApi(api, apiArg);
  }

  // initComplete: () => {
  //   try {
  //     const delegator = getDelegator('initComplete');
  //     delegator();
  //   } catch (err) {}
  // },

  // insertText: (text: string) => {
  //   try {
  //     const delegator = getDelegator('insertText', text);
  //     delegator();
  //   } catch (err) {}
  // },

  // insertHtml: (html: string) => {
  //   try {
  //     const delegator = getDelegator('insertHtml', html);
  //     delegator();
  //   } catch (err) {}
  // },

  // downloadImage: async (img: Blob) => {
  //   try {
  //     const text = await fileToString(img);
  //     const delegator = getDelegator('downloadImage', text);
  //     delegator();
  //   } catch (err) {}
  // },

  // insertImage: async (img: Blob) => {
  //   try {
  //     const text = await fileToString(img);
  //     const delegator = getDelegator('insertImage', text);
  //     delegator();
  //   } catch (err) {}
  // },

  // openWindow: (target: string) => {
  //   try {
  //     const delegator = getDelegator('openWindow', target);
  //     delegator();
  //   } catch (err) {}
  // },

  // openDoc: async (doc: Blob) => {
  //   try {
  //     const text = await fileToString(doc);
  //     const delegator = getDelegator('openDoc', text);
  //     delegator();
  //   } catch (err) {}
  // },

  // closePanel: () => {
  //   try {
  //     const delegator = getDelegator('closePanel');
  //     delegator();
  //   } catch (err) {}
  // }
};

export default Bridge;
