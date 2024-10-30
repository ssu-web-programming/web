import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetCurrentWrite } from 'store/slices/writeHistorySlice';
import { v4 as uuidv4 } from 'uuid';

import { createAsyncThunk } from '@reduxjs/toolkit';

import useManageFile from '../components/hooks/nova/useManageFile';
import gI18n, { convertLangFromLangCode } from '../locale';
import { AskDocStatus, setSrouceId, setStatus } from '../store/slices/askDoc';
import { setFiles } from '../store/slices/askDocAnalyzeFiesSlice';
import { initConfirm } from '../store/slices/confirm';
import {
  resetPageData,
  resetPageResult,
  setPageStatus
} from '../store/slices/nova/pageStatusSlice';
import { setPlatformInfo } from '../store/slices/platformInfo';
import { setRecognizedVoice } from '../store/slices/recognizedVoice';
import { NOVA_TAB_TYPE, selectNovaTab, setCreating } from '../store/slices/tabSlice';
import { activeToast } from '../store/slices/toastSlice';
import { updateT2ICurItemIndex, updateT2ICurListId } from '../store/slices/txt2imgHistory';
import {
  removeLoadingFile,
  setCurrentFile,
  setDriveFiles,
  setLoadingFile,
  setLocalFiles
} from '../store/slices/uploadFiles';
import store, { AppDispatch, RootState, useAppDispatch } from '../store/store';

import { isHigherVersion, makeClipboardData } from './common';
import { base64ToFile, blobToFile } from './files';

const UA_PREFIX = `__polaris_office_ai_`;

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
    const ua = userAgent.toLowerCase();

    const platform = Object.values(ClientType).find(
      (type) => ua.search(`${UA_PREFIX}${type}`) > -1
    );

    if (platform) return platform;
  }
  return ClientType.unknown;
}

function getAgentVersion(userAgent: string) {
  const versionPattern = /PolarisPCOffice\/(\d+(\.\d+)*)|Version\/(\d+(\.\d+)*)/;
  const match = userAgent.match(versionPattern);

  return match ? match[1] || match[3] : null;
}

export const getPlatform = () => getAgentPlatform(navigator.userAgent);
export const getVersion = () => getAgentVersion(navigator.userAgent);

export async function fileToString(file: Blob) {
  return new Promise<string>((resolve) => {
    try {
      const reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result) {
          resolve(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('An error occurred:', err);
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
          case 'downloadAnimation': {
            window.webkit.messageHandlers.downloadAnimation.postMessage(arg);
            break;
          }
          case 'insertImage': {
            window.webkit.messageHandlers.insertImage.postMessage(arg);
            break;
          }
          case 'insertAnimation': {
            window.webkit.messageHandlers.insertAnimation.postMessage(arg);
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
          case 'getClientStatus': {
            if (window.webkit.messageHandlers.getClientStatus) {
              window.webkit.messageHandlers.getClientStatus.postMessage(arg);
            }
            break;
          }
          case 'openPoDriveFile': {
            if (window.webkit.messageHandlers.openPoDriveFile) {
              window.webkit.messageHandlers.openPoDriveFile.postMessage(arg);
            }
            break;
          }
          case 'curNovaTab': {
            if (window.webkit.messageHandlers.curNovaTab) {
              window.webkit.messageHandlers.curNovaTab.postMessage(arg);
            }
            break;
          }
          case 'analyzeCurFile': {
            if (window.webkit.messageHandlers.analyzeCurFile) {
              window.webkit.messageHandlers.analyzeCurFile.postMessage(arg);
            }
            break;
          }
          case 'uploadFile': {
            if (window.webkit.messageHandlers.uploadFile) {
              window.webkit.messageHandlers.uploadFile.postMessage(arg);
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
  } catch (err) {
    /*empty*/
  }
};

declare global {
  interface Window {
    callbackMessage: (msg: CallbackMessage) => void;
    receiveMessage: (msg: ReceiveMessage) => void;
  }
}

type BridgeItemID = string;

interface CallbackMessage {
  cmdID: BridgeItemID;
  body: any;
}

interface ReceiveMessage {
  cmd: string;
  body: any;
}

type Callback = (msg: CallbackMessage, id: BridgeItemID) => void;

interface BridgeItem {
  id: BridgeItemID;
  callback: Callback;
}

const BridgeList: { [id: BridgeItemID]: BridgeItem } = {};

type PanelOpenCmd = 'openAiTools' | 'openTextToImg' | 'openAskDoc' | 'openAlli' | 'openNOVA';

export const useInitBridgeListener = () => {
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const { getFileInfo, loadLocalFile } = useManageFile();

  // const movePage = useMoveChatTab();
  const getPath = useCallback((cmd: PanelOpenCmd) => {
    switch (cmd) {
      case 'openAiTools':
        return '/aiWrite';
      case 'openTextToImg':
        return '/txt2img';
      case 'openAskDoc': {
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
      }
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
          // movePage(body);
          thunkAPI.dispatch(resetCurrentWrite());
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
    const state = store.getState();
    const selectedNovaTab = state.tab.selectedNovaTab;

    try {
      const { cmd, body } = msg;
      if (cmd && cmd !== '') {
        switch (cmd) {
          case 'openAiTools':
          case 'openTextToImg':
          case 'openAskDoc':
          case 'openAlli': {
            dispatch(changePanel({ cmd, body }));
            break;
          }
          case 'openNOVA': {
            console.log('body: ', body);
            dispatch(changePanel({ cmd, body: body.inputText || '' }));
            dispatch(setDriveFiles([]));
            dispatch(setPageStatus({ tab: 'aiChat', status: 'home' }));
            if (body.openTab in NOVA_TAB_TYPE) {
              dispatch(selectNovaTab(NOVA_TAB_TYPE[body.openTab as keyof typeof NOVA_TAB_TYPE]));
              if (body.image) {
                let file: File | null = null;

                if (body.image.size > 0 && body.image.type) {
                  file = blobToFile(body.image);
                } else if (typeof body.image === 'string' && body.image.startsWith('data:')) {
                  const base64Data = body.image.split(',')[1];
                  const mimeType = body.image.match(/data:(.*);base64/)?.[1] || 'image/png';
                  file = base64ToFile(base64Data, mimeType);
                }

                if (body.openTab != NOVA_TAB_TYPE.aiChat && file) {
                  dispatch(resetPageData(body.openTab));
                  dispatch(resetPageResult(body.openTab));
                  dispatch(setPageStatus({ tab: body.openTab, status: 'home' }));
                  await loadLocalFile([file]);
                } else {
                  dispatch(setLocalFiles([]));
                }
              } else {
                dispatch(setLocalFiles([]));
              }
            }

            const platform = getPlatform();
            const version = getVersion();
            console.log('bridge platform: ', platform);
            console.log('bridge version: ', version);
            if (platform != ClientType.unknown && version) {
              dispatch(setPlatformInfo({ platform: platform, version: version }));
            } else {
              console.log('body platform: ', body.platform);
              console.log('body version: ', body.version);
              if (!body.platform) return;
              dispatch(
                setPlatformInfo({
                  platform: body.platform as ClientType,
                  version: body.version
                })
              );
            }

            Bridge.callBridgeApi('analyzeCurFile');

            break;
          }
          case 'getFileInfo': {
            dispatch(
              setCurrentFile({
                type: body.type,
                id: body.id,
                size: body.size,
                ext: body.ext,
                isSaved: body.isSaved
              })
            );
            break;
          }
          case 'finishUploadFile': {
            dispatch(setPageStatus({ tab: 'aiChat', status: 'home' }));
            dispatch(setLocalFiles([]));
            dispatch(setDriveFiles([]));
            dispatch(setLoadingFile({ id: body.fileId }));
            const currentFile = await getFileInfo(body.fileId);
            dispatch(removeLoadingFile());

            dispatch(setDriveFiles([currentFile]));
            dispatch(setCreating('none'));
            break;
          }
          case 'finishDownloadImage': {
            if (body.isSaved) {
              dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.SaveCompleted`) }));
            }
            break;
          }
          case 'finishDownloadAnimation': {
            dispatch(setPageStatus({ tab: selectedNovaTab, status: 'done' }));
            if (body.isSaved) {
              dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.SaveCompleted`) }));
            }
            break;
          }
          case 'finishInsertAnimation': {
            dispatch(setPageStatus({ tab: selectedNovaTab, status: 'done' }));
            dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
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
            dispatch(setSrouceId(body));
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
    } catch (err) {
      /*empty*/
    }
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
      } catch (err) {
        /*empty*/
      }
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
      } catch (err) {
        /*empty*/
      }
    });

    Bridge.callBridgeApi('initComplete');
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
  | 'downloadAnimation'
  | 'insertImage'
  | 'insertAnimation'
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
  | 'insertNote'
  | 'getClientStatus'
  | 'openPoDriveFile'
  | 'changeScreenSize'
  | 'pchome_mydoc'
  | 'curNovaTab'
  | 'analyzeCurFile'
  | 'uploadFile';

const Bridge = {
  checkSession: (api: string) => {
    return new Promise<CheckSessionResponse>((resolve, reject) => {
      const callback = async (sessionInfo: CallbackMessage, id: BridgeItemID) => {
        try {
          const { body } = sessionInfo;
          const AID = body['AID'] || '';
          const BID = body['BID'] || '';
          const SID = body['SID'] || '';

          const res = await fetch('/api/v2/user/getCurrentLoginStatus', {
            headers: {
              'content-type': 'application/json',
              'X-PO-AI-MayFlower-Auth-AID': AID,
              'X-PO-AI-MayFlower-Auth-BID': BID,
              'X-PO-AI-MayFlower-Auth-SID': SID,
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
              sessionInfo: { AID: AID, BID: BID, SID: SID },
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
          id: `${api}_${Date.now()}_${uuidv4()}`,
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
            console.error('An error occurred:', err);
          } finally {
            delete BridgeList[id];
          }
        }
      };
      BridgeList[item.id] = item;

      callApi(api, arg);
    } catch (err) {
      /*empty*/
    }
  }
};

export default Bridge;

export function useCopyClipboard() {
  return async (target: string | Blob) => {
    const clipboardData = await makeClipboardData(target);
    await Bridge.callBridgeApi('copyClipboard', JSON.stringify(clipboardData));
  };
}
