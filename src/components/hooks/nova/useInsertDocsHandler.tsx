import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { ClientStatusType } from '../../../pages/Nova/Nova';
import { NovaChatType } from '../../../store/slices/nova/novaHistorySlice';
import {
  resetPageData,
  resetPageResult,
  selectPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { activeToast } from '../../../store/slices/toastSlice';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import Bridge from '../../../util/bridge';
import { base64ToBlob, insertDoc } from '../../../util/common';
import { useConfirm } from '../../Confirm';

export const useInsertDocsHandler = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const result = useAppSelector(selectPageResult(selectedNovaTab));

  const ShowExpireLinkPopup = async () => {
    confirm({
      title: '',
      msg: t('Nova.Confirm.ExpireImageLink.Msg'),
      onOk: {
        text: t('OK'),
        callback: () => {
          dispatch(setLocalFiles([]));
          dispatch(setDriveFiles([]));
          dispatch(resetPageData(selectedNovaTab));
          dispatch(resetPageResult(selectedNovaTab));
          dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
        }
      }
    });
  };

  const insertDocsHandler = useCallback(
    async (history?: NovaChatType, outPutTxt?: string) => {
      Bridge.callSyncBridgeApiWithCallback({
        api: 'getClientStatus',
        callback: async (status: ClientStatusType) => {
          console.log('status', status);
          switch (status) {
            case 'home':
              confirm({
                title: t(`Nova.Chat.InsertDoc.Fail.Title`)!,
                msg: t(`Nova.Chat.InsertDoc.Fail.Msg.Home`)!,
                onOk: {
                  text: t(`Confirm`),
                  callback: () => {}
                }
              });
              break;
            case 'doc_view_mode':
              if (
                selectedNovaTab === NOVA_TAB_TYPE.translation ||
                selectedNovaTab === NOVA_TAB_TYPE.voiceDictation
              ) {
                confirm({
                  title: t(`Nova.Chat.InsertDoc.Fail.Title`)!,
                  msg: t(`Nova.Chat.InsertDoc.Fail.Msg.Translation`)!,
                  onOk: {
                    text: t(`Confirm`),
                    callback: () => {}
                  }
                });
              } else {
                confirm({
                  title: t(`Nova.Chat.InsertDoc.Fail.Title`)!,
                  msg: t(`Nova.Chat.InsertDoc.Fail.Msg.Viewer`)!,
                  onOk: {
                    text: t(`Confirm`),
                    callback: () => {}
                  }
                });
              }

              break;
            case 'doc_edit_mode':
              if (history) {
                switch (history.askType) {
                  case 'image': {
                    try {
                      const res = await fetch(history.res!);
                      const blob = await res.blob();
                      Bridge.callBridgeApi('insertImage', blob);
                      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                    } catch (err) {
                      throw err;
                    }
                    break;
                  }
                  case 'document':
                  default: {
                    insertDoc(history.output);
                    dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                    break;
                  }
                }
              } else if (selectedNovaTab === NOVA_TAB_TYPE.translation) {
                insertDoc(history!.output);
                dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
              } else if (selectedNovaTab === NOVA_TAB_TYPE.voiceDictation) {
                if (outPutTxt) {
                  insertDoc(outPutTxt);
                  dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                }
              } else {
                if (!result) break;
                if (result.link) {
                  try {
                    const res = await fetch(result.link, { method: 'HEAD' });
                    const contentType = res.headers.get('Content-Type');
                    if (contentType && contentType.includes('text/html')) {
                      ShowExpireLinkPopup();
                    } else {
                      dispatch(setPageStatus({ tab: selectedNovaTab, status: 'saving' }));
                      Bridge.callBridgeApi('insertAnimation', result.link);
                    }
                  } catch (err) {
                    ShowExpireLinkPopup();
                  }
                } else {
                  const blob = base64ToBlob(result.data, result.contentType);
                  Bridge.callBridgeApi('insertImage', blob);
                  dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                }
              }
              break;
          }
        }
      });
    },
    [dispatch, t, confirm]
  );

  return { insertDocsHandler };
};
