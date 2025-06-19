import { useConfirm } from 'components/Confirm';
import { TRANSLATION_EXTENSION_TYPE } from 'constants/fileTypes';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
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
  const { getFileInfo, validateCurFileSize } = useManageFile({});
  const { getAvailableFileCnt } = useUserInfoUtils();

  const analysisCurDoc = async () => {
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
      if (!validateCurFileSize(currentFile)) return;
      if (selectedNovaTab === NOVA_TAB_TYPE.translation) {
        if (!TRANSLATION_EXTENSION_TYPE.includes(`.${currentFile.ext}`)) {
          await confirm({
            msg: t('Nova.translation.Alert.UnsupportedFormat')
          });
          return;
        }
      }

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
        await confirmSaveDoc(platform === ClientType.web ? true : false);
      }
    } else if (currentFile.type === 'local' || currentFile.type === 'unknown') {
      if (!validateCurFileSize(currentFile)) return;

      await confirmUploadFile();
    }
  };

  const confirmSaveDoc = async (isCancel: boolean) => {
    await confirm({
      msg:
        platform === ClientType.web || platform === 'unknown'
          ? t('Nova.Confirm.NotSavedFileInWeb.Msg')
          : selectedNovaTab === 'translation'
            ? t('Nova.translation.Alert.UnsavedChanges')
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
      msg:
        selectedNovaTab === 'translation'
          ? t('Nova.Confirm.AnalyzeFile.Msg')
          : t('Nova.Confirm.UploadFile.Msg'),
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
