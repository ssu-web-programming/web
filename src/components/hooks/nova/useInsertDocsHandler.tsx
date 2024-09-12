import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ClientStatusType } from '../../../pages/Nova/Nova';
import { NovaChatType } from '../../../store/slices/nova/novaHistorySlice';
import { activeToast } from '../../../store/slices/toastSlice';
import { useAppDispatch } from '../../../store/store';
import Bridge from '../../../util/bridge';
import { insertDoc } from '../../../util/common';
import { useConfirm } from '../../Confirm';

export const useInsertDocsHandler = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();

  const insertDocsHandler = useCallback(
    async (history: NovaChatType) => {
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
              break;
          }
        }
      });
    },
    [dispatch, t, confirm]
  );

  return { insertDocsHandler };
};
