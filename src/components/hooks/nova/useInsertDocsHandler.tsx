import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ClientStatusType } from '../../../pages/Nova/Nova';
import { NovaChatType } from '../../../store/slices/nova/novaHistorySlice';
import { selectPageResult, setPageStatus } from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../../store/slices/tabSlice';
import { activeToast } from '../../../store/slices/toastSlice';
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

  const insertDocsHandler = useCallback(
    async (history?: NovaChatType) => {
      Bridge.callSyncBridgeApiWithCallback({
        api: 'getClientStatus',
        callback: async (status: ClientStatusType) => {
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
              confirm({
                title: t(`Nova.Chat.InsertDoc.Fail.Title`)!,
                msg: t(`Nova.Chat.InsertDoc.Fail.Msg.Viewer`)!,
                onOk: {
                  text: t(`Confirm`),
                  callback: () => {}
                }
              });
              break;
            case 'doc_edit_mode':
              if (selectedNovaTab === NOVA_TAB_TYPE.aiChat && history) {
                switch (history.askType) {
                  case 'image': {
                    try {
                      const res = await fetch(history.res!);
                      const blob = await res.blob();
                      Bridge.callBridgeApi('insertImage', blob);
                      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                    } catch (err) {
                      // Handle the error appropriately here
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
              } else {
                if (!result) break;
                if (result.link) {
                  dispatch(setPageStatus({ tab: selectedNovaTab, status: 'progress' }));
                  Bridge.callBridgeApi('insertAnimation', result.link);
                } else {
                  const blob = base64ToBlob(result.data, result.contentType);
                  dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
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
