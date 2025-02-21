import { useConfirm } from 'components/Confirm';
import { useTranslationContext } from 'pages/Nova/Translation/provider/translation-provider';
import { useTranslation } from 'react-i18next';
import { setPageStatus } from 'store/slices/nova/pageStatusSlice';
import { platformInfoSelector } from 'store/slices/platformInfo';
import { selectTabSlice, setCreating } from 'store/slices/tabSlice';
import {
  getCurrentFile,
  removeLoadingFile,
  setDriveFiles,
  setLoadingFile,
  setLocalFiles
} from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';
import Bridge, { ClientType } from 'util/bridge';

import useManageFile from '../nova/useManageFile';
import useUserInfoUtils from '../useUserInfoUtils';

export default function useCurrentDocAnalysis() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const currentFile = useAppSelector(getCurrentFile);
  const { platform } = useAppSelector(platformInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { getFileInfo } = useManageFile({});
  const { getAvailableFileCnt } = useUserInfoUtils();
  const {
    sharedTranslationInfo: { originalFileType }
  } = useTranslationContext();

  const analysisCurDoc = async () => {
    console.log('currentFile 호출됐니?', currentFile);
    if (currentFile.type === 'notSupported') {
      await confirm({
        msg: t('Nova.Alert.UnopenableDocError', { max: getAvailableFileCnt(selectedNovaTab) })!,
        onOk: {
          text: t('Confirm'),
          callback: () => {
            dispatch(setCreating('none'));
          }
        }
      });
    } else if (currentFile.type === 'drive') {
      if (Number(currentFile.id) === -1) {
        await confirmSaveDoc(true);
      } else if (currentFile.isSaved) {
        dispatch(setCreating('NOVA'));
        dispatch(setLocalFiles([]));
        dispatch(setDriveFiles([]));

        dispatch(setLoadingFile({ id: currentFile.id }));
        const curFile = await getFileInfo(currentFile.id);
        dispatch(removeLoadingFile());

        dispatch(setDriveFiles([curFile]));
        dispatch(setCreating('none'));
      } else {
        await confirmSaveDoc(false);
      }
    } else if (currentFile.type === 'local' || currentFile.type === 'unknown') {
      if (originalFileType === 'local') {
        await confirmTranslationUploadFile();
        return;
      }
      await confirmUploadFile();
    }
  };

  const confirmSaveDoc = async (isCancel: boolean) => {
    await confirm({
      msg:
        platform === ClientType.web || platform === 'unknown'
          ? t('Nova.Confirm.NotSavedFileInWeb.Msg')
          : t('Nova.Confirm.NotSavedFile.Msg'),
      onOk: {
        text: t('Nova.Confirm.NotSavedFile.Ok'),
        callback: () => {
          dispatch(setPageStatus({ tab: selectedNovaTab, status: 'progress' }));
          Bridge.callBridgeApi('uploadFile');
        }
      },
      onCancel: isCancel
        ? {
            text: t('Cancel'),
            callback: async () => {
              dispatch(setCreating('none'));
              dispatch(setLocalFiles([]));
              dispatch(setDriveFiles([]));
            }
          }
        : {
            text: t('Nova.Confirm.NotSavedFile.Cancel'),
            callback: async () => {
              dispatch(setCreating('NOVA'));
              dispatch(setLocalFiles([]));
              dispatch(setDriveFiles([]));

              dispatch(setLoadingFile({ id: currentFile.id }));
              const curFile = await getFileInfo(currentFile.id);
              dispatch(removeLoadingFile());

              dispatch(setDriveFiles([curFile]));
              dispatch(setCreating('none'));
            }
          }
    });
  };

  const confirmUploadFile = async () => {
    await confirm({
      msg: t('Nova.Confirm.UploadFile.Msg'),
      onOk: {
        text: t('Nova.Confirm.UploadFile.Ok'),
        callback: () => {
          dispatch(setPageStatus({ tab: selectedNovaTab, status: 'progress' }));
          Bridge.callBridgeApi('uploadFile');
        }
      }
    });
  };

  const confirmTranslationUploadFile = async () => {
    await confirm({
      msg: t('Nova.Confirm.UploadFile.Msg'),
      onOk: {
        text: t('Nova.Confirm.UploadFile.Ok'),
        callback: () => {
          dispatch(setPageStatus({ tab: selectedNovaTab, status: 'progress' }));
          Bridge.callBridgeApi('uploadFile');
        }
      },
      onCancel: {
        text: t('Nova.Confirm.UploadFile.Cancel'),
        callback: () => {}
      }
    });
  };

  return {
    analysisCurDoc
  };
}
