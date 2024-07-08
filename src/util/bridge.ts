import { useCallback } from 'react';
import { AppDispatch, RootState, useAppDispatch } from '../store/store';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMoveChatTab } from '../components/hooks/useMovePage';
import { updateT2ICurItemIndex, updateT2ICurListId } from '../store/slices/txt2imgHistory';
import { activeToast } from '../store/slices/toastSlice';
import gI18n, { convertLangFromLangCode } from '../locale';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { isHigherVersion, makeClipboardData } from './common';
import { AskDocStatus, setSrouceId, setStatus } from '../store/slices/askDoc';
import { setFiles } from '../store/slices/askDocAnalyzeFiesSlice';
import { initComplete } from '../store/slices/initFlagSlice';
import { setRecognizedVoice } from '../store/slices/recognizedVoice';
import { initConfirm } from '../store/slices/confirm';

const UA_PREFIX: string = `__polaris_office_ai_`;

export enum ClientType {
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

function getAgentVersion(userAgent: string) {
  const versionPattern = /Version\/(\d+(\.\d+)*)/;
  const match = userAgent.match(versionPattern);
  return match ? match[1] : null;
}

export const getPlatform = () => getAgentPlatform(navigator.userAgent);
export const getVersion = () => getAgentVersion(navigator.userAgent);

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

const callApi = (api: ApiType, arg?: string | number) => {
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
          case 'analyzeFiles': {
            window.webkit.messageHandlers.analyzeFiles.postMessage(arg);
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
          case 'copyClipboard': {
            if (window.webkit.messageHandlers.copyClipboard) {
              window.webkit.messageHandlers.copyClipboard.postMessage(arg);
            }
            break;
          }
          case 'movePage': {
            if (window.webkit.messageHandlers.movePage) {
              window.webkit.messageHandlers.movePage.postMessage(arg);
            }
            break;
          }
          case 'reInitAskDoc': {
            if (window.webkit.messageHandlers.reInitAskDoc) {
              window.webkit.messageHandlers.reInitAskDoc.postMessage(arg);
            }
            break;
          }
          case 'shareAnswerState': {
            if (window.webkit.messageHandlers.shareAnswerState) {
              window.webkit.messageHandlers.shareAnswerState.postMessage(arg);
            }
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

interface CallbackMessage {
  cmdID: BridgeItemID;
  body: any;
}

interface ReceiveMessage {
  cmd: string;
  body: string;
}

type PanelOpenCmd = 'openAiTools' | 'openTextToImg' | 'openAskDoc' | 'openAlli' | 'openNOVA';

export const useInitBridgeListener = () => {
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const movePage = useMoveChatTab();
  const getPath = useCallback((cmd: PanelOpenCmd) => {
    switch (cmd) {
      case 'openAiTools':
        return '/aiWrite';
      case 'openTextToImg':
        return '/txt2img';
      case 'openAskDoc':
        const platform = getPlatform();
        const version = getVersion();
        if (
          (platform === ClientType.android && isHigherVersion('9.8.6', version)) ||
          (platform === ClientType.ios && isHigherVersion('9.7.14', version)) ||
          platform === ClientType.windows ||
          platform === ClientType.mac
        ) {
          return '/AskDocStep';
        }
        return '/askdoc';
      case 'openAlli':
        return '/alli';
      case 'openNOVA':
        return '/NOVA';
    }
  }, []);

  const changePanel = createAsyncThunk<
    void,
    ReceiveMessage,
    {
      dispatch: AppDispatch;
      state: RootState;
    }
  >('changePanel', async ({ cmd, body }, thunkAPI) => {
    const {
      tab: { creating }
    } = thunkAPI.getState();

    const path = getPath(cmd as PanelOpenCmd);
    if (creating === 'none') {
      if (cmd === `openAiTools`) {
        if (body && body !== '') {
          movePage(body);
        }
      } else if (cmd === `openTextToImg`) {
        if (body && body !== '') {
          thunkAPI.dispatch(updateT2ICurListId(null));
          thunkAPI.dispatch(updateT2ICurItemIndex(null));
        }
      }
      navigate(`${path}${location.search}`, {
        state: { body },
        replace: true
      });
      thunkAPI.dispatch(initConfirm());
    } else {
      if (window.location.pathname !== path) {
        thunkAPI.dispatch(
          activeToast({
            type: 'error',
            msg: t(`ToastMsg.TabLoadedAndWait`, { tab: t(creating) })
          })
        );
      }
    }
  });

  const procMsg = async (msg: any) => {
    try {
      const { cmd, body } = msg;
      if (cmd && cmd !== '') {
        switch (cmd) {
          case 'openAiTools':
          case 'openTextToImg':
          case 'openAskDoc':
          case 'openAlli':
          case 'openNOVA': {
            dispatch(changePanel({ cmd, body }));
            break;
          }
          case 'showToast': {
            const msg = i18n.t(body);
            dispatch(activeToast({ type: 'error', msg }));
            break;
          }
          case 'changeLang': {
            const lang = convertLangFromLangCode(body);
            gI18n.changeLanguage(lang);
            break;
          }
          case 'initAskDoc': {
            const sourceId = body;
            dispatch(setSrouceId(sourceId));
            break;
          }
          case 'askDocState': {
            switch (body as AskDocStatus) {
              case 'failedConvert':
              case 'failedAnalyze': {
                dispatch(setStatus(body));
                break;
              }
            }
            break;
          }
          case 'analyzeFiles': {
            dispatch(
              setFiles({
                isLoading: false,
                files: body.files,
                isSuccsess: true,
                fileStatus: null,
                userId: body.userId,
                isInitialized: true
              })
            );
            break;
          }
          case 'recognizeVoiceData': {
            dispatch(setRecognizedVoice({ recognizedVoice: body }));
            break;
          }
          default: {
            break;
          }
        }
      }
    } catch (err) {}
  };

  return () => {
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
      procMsg(msg);
    };

    window.addEventListener('message', (msg) => {
      try {
        if (msg.data.cmdID) {
          window.callbackMessage(msg.data);
        } else {
          procMsg(msg.data);
        }
      } catch (err) {}
    });

    Bridge.callBridgeApi('initComplete');
    dispatch(
      initComplete({
        isInit: true
      })
    );
  };
};

export interface CheckSessionResponse {
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
  | 'getSessionInfo'
  | 'copyClipboard'
  | 'movePage'
  | 'reInitAskDoc'
  | 'shareAnswerState'
  | 'analyzeFiles'
  | 'setVoiceRecognizeMode'
  | 'textToSpeech'
  | 'getDocType'
  | 'getSlideContents'
  | 'insertNote';

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

  callBridgeApi: async (api: ApiType, arg?: string | number | Blob) => {
    const apiArg =
      arg && typeof arg !== 'string' && typeof arg !== 'number' ? await fileToString(arg) : arg;
    callApi(api, apiArg);
  },
  callSyncBridgeApiWithCallback: (param: {
    api: ApiType;
    arg?: string | number;
    callback: (res: any) => void;
  }) => {
    try {
      const { api, arg, callback } = param;
      const item = {
        id: api,
        callback: (msg: CallbackMessage, id: BridgeItemID) => {
          try {
            callback(msg.body);
          } catch (err) {
          } finally {
            delete BridgeList[id];
          }
        }
      };
      BridgeList[item.id] = item;

      callApi(api, arg);
    } catch (err) {}
  }
};

export default Bridge;

export function useCopyClipboard() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return async (markdown: string) => {
    const clipboardData = await makeClipboardData(markdown);
    await Bridge.callBridgeApi('copyClipboard', JSON.stringify(clipboardData));
    dispatch(activeToast({ type: 'success', msg: t(`ToastMsg.CopyCompleted`) }));
  };
}
