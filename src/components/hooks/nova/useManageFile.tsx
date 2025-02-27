import { Dispatch, SetStateAction } from 'react';
import { useConfirm } from 'components/Confirm';
import { useVoiceDictationContext } from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import { useTranslation } from 'react-i18next';
import { activeLoadingSpinner, initLoadingSpinner } from 'store/slices/loadingSpinner';
import { uploadFiles } from 'util/files';

import { apiWrapper } from '../../../api/apiWrapper';
import { PO_DRIVE_FILEINFO, PO_DRIVE_LIST } from '../../../api/constant';
import {
  ALLOWED_MIME_TYPES,
  AUDIO_SUPPORT_TYPE,
  getMaxFileSize,
  getValidExt,
  isValidFileSize,
  MIN_FILE_UPLOAD_SIZE_KB,
  SUPPORT_DOCUMENT_TYPE,
  SupportFileType,
  TRANSLATION_EXTENSION_TYPE,
  TRANSLATION_SUPPORT_TYPE
} from '../../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { novaHistorySelector } from '../../../store/slices/nova/novaHistorySlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import {
  CurrentFileInfo,
  DriveFileInfo,
  setDriveFiles,
  setLocalFiles
} from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { getFileExtension } from '../../../util/common';
import { useChatNova } from '../useChatNova';
import useUserInfoUtils from '../useUserInfoUtils';

interface Props {
  onFinishCallback?: () => void;
  onClearPastedImages?: () => void;
}

interface ValidationResult {
  isValid: boolean;
  invalidFiles: File[];
  validFiles: File[];
  invalidReason: {
    // 실패 이유를 구분하기 위해 추가
    type: File[]; // 타입이 맞지 않는 파일들
    size: File[]; // 크기가 초과된 파일들
  };
}

export function useManageFile({ onFinishCallback, onClearPastedImages }: Props = {}) {
  const { t } = useTranslation();
  const chatNova = useChatNova();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { getMaxFilesPerUpload, getAvailableFileCnt } = useUserInfoUtils();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { handleAudioDuration } = useVoiceDictationContext();

  const validateFiles = (files: File[], maxFileSize: number): ValidationResult => {
    const result: ValidationResult = {
      isValid: true,
      invalidFiles: [],
      validFiles: [],
      invalidReason: {
        type: [],
        size: []
      }
    };

    files.forEach((file) => {
      let isFileValid = true;
      const fileName = file.name.toLowerCase();
      const extractFileType = fileName.slice(fileName.lastIndexOf('.'));
      // 파일 타입 검사
      if (!TRANSLATION_EXTENSION_TYPE.includes(extractFileType)) {
        console.log('file', file.type);
        isFileValid = false;
        result.invalidReason.type.push(file);
      }

      // 파일 크기 검사
      if (file.size > maxFileSize) {
        isFileValid = false;
        result.invalidReason.size.push(file);
      }

      if (isFileValid) {
        result.validFiles.push(file);
      } else {
        result.invalidFiles.push(file);
      }
    });

    result.isValid = result.invalidFiles.length === 0;

    return result;
  };

  const confirmTranslationUploadFile = async (files: File[]) => {
    await confirm({
      msg: t('Nova.Confirm.AnalyzeFile.Msg'),
      onOk: {
        text: t('Nova.Confirm.UploadFile.Ok'),
        callback: async () => {
          dispatch(activeLoadingSpinner());
          const result = await uploadFiles(files);
          const file = result[0].data;
          dispatch(initLoadingSpinner());
          dispatch(setDriveFiles([{ ...file, name: file.fileName }]));
        }
      },
      onCancel: {
        text: t('Nova.Confirm.UploadFile.Cancel'),
        callback: () => {}
      }
    });
  };

  const validateFileUpload = async (files: File[], maxFileSize: number) => {
    const validation = validateFiles(files, maxFileSize);

    // 실패했을때 나오는 팝업
    if (validation.invalidReason.type.length > 0) {
      await confirm({
        msg: t('Nova.translation.Alert.UnsupportedFormat')
      });
      return false;
    }

    if (validation.invalidReason.size.length > 0) {
      await confirm({
        msg: t('Nova.translation.Alert.FileSizeLimit')
      });
      return false;
    }

    return true;
  };

  const uploadTranslationFile = async (files: File[], maxFileSize: number) => {
    const isValid = await validateFileUpload(files, maxFileSize);
    if (!isValid) return;
    await confirmTranslationUploadFile(files);
  };

  const loadLocalFile = async (files: File[]) => {
    dispatch(setDriveFiles([]));
    onFinishCallback?.();
    onClearPastedImages?.();

    const maxFileUploadCntOnce = getMaxFilesPerUpload(selectedNovaTab);
    if (files.length > maxFileUploadCntOnce) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFileUploadCntOnce', { max: maxFileUploadCntOnce })!,
        onOk: {
          text: t('Confirm'),
          callback: () => {}
        }
      });
      return;
    }

    const uploadLimit = getAvailableFileCnt(selectedNovaTab);
    if (uploadLimit !== -1 && selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
      const uploadCnt = novaHistory.reduce((acc, cur) => {
        const len = cur.files?.length;
        if (len) return acc + len;
        else return acc;
      }, 0);

      if (uploadCnt + files.length > uploadLimit) {
        await confirm({
          title: '',
          msg: t('Nova.Confirm.OverMaxFileUploadCnt', { max: uploadLimit })!,
          onOk: { text: t('Nova.Confirm.NewChat.StartNewChat'), callback: chatNova.newChat },
          onCancel: {
            text: t('Cancel'),
            callback: () => {}
          }
        });
        return;
      }
    }

    const supportedExtensions =
      selectedNovaTab === NOVA_TAB_TYPE.home || selectedNovaTab === NOVA_TAB_TYPE.aiChat
        ? [
            ...SUPPORT_DOCUMENT_TYPE.flatMap((type) => type.extensions),
            ...getValidExt(selectedNovaTab).flatMap((type) => type.extensions)
          ]
        : selectedNovaTab === 'translation'
          ? [
              ...TRANSLATION_SUPPORT_TYPE.flatMap((type) => type.extensions),
              ...getValidExt(selectedNovaTab).flatMap((type) => type.extensions)
            ]
          : selectedNovaTab === NOVA_TAB_TYPE.voiceDictation
            ? [...AUDIO_SUPPORT_TYPE.flatMap((type) => type.extensions)]
            : [...getValidExt(selectedNovaTab).flatMap((type) => type.extensions)];

    const invalidFiles = files.filter((file) => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return !supportedExtensions.includes(fileExtension);
    });
    const support = supportedExtensions.filter((ext) => ext !== '.jpeg').join(', ');
    if (invalidFiles.length > 0) {
      await confirm({
        title: '',
        msg:
          selectedNovaTab === NOVA_TAB_TYPE.home || selectedNovaTab === NOVA_TAB_TYPE.aiChat
            ? t('Nova.Alert.CommonUnsupportFile')
            : selectedNovaTab === 'voiceDictation'
              ? t('Nova.translation.Alert.CommonUnsupportVoiceFile')
              : t(`Nova.Alert.CommonUnsupportImage`, { support }),
        onOk: {
          text: t('Confirm'),
          callback: () => {
            return;
          }
        }
      });
      return;
    }

    if (!validateFileSize(files)) return;

    if (selectedNovaTab === NOVA_TAB_TYPE.voiceDictation) {
      if (handleAudioDuration && files.length > 0) {
        await handleAudioDuration(files[0]); // 오디오 파일 처리
      }
    }

    dispatch(setLocalFiles(files));
  };

  const loadDriveFile = async (files: DriveFileInfo[]) => {
    const uploadLimit = getAvailableFileCnt(selectedNovaTab);
    if (uploadLimit !== -1 && selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
      const uploadCnt = novaHistory.reduce((acc, cur) => {
        const len = cur.files?.length;
        if (len) return acc + len;
        else return acc;
      }, 0);

      if (uploadCnt + files.length > uploadLimit) {
        await confirm({
          title: '',
          msg: t('Nova.Confirm.OverMaxFileUploadCnt', { max: uploadLimit })!,
          onOk: { text: t('Nova.Confirm.NewChat.StartNewChat'), callback: chatNova.newChat },
          onCancel: {
            text: t('Cancel'),
            callback: () => {}
          }
        });
        return;
      }
    }

    onFinishCallback?.();
    onClearPastedImages?.();
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles(files));
  };

  const validateFileSize = (files: File[]) => {
    const invalidSize = files.filter((file) => !isValidFileSize(file.size, selectedNovaTab));
    if (invalidSize.length > 0) {
      confirm({
        title: '',
        msg: t('Nova.Alert.OverFileUploadSize', {
          max: getMaxFileSize(selectedNovaTab),
          min: MIN_FILE_UPLOAD_SIZE_KB
        })!,
        onOk: {
          text: t('Confirm'),
          callback: () => {
            return false;
          }
        }
      });
      return false;
    }
    return true;
  };

  const validateCurFileSize = (file: CurrentFileInfo) => {
    if (!isValidFileSize(file.size, selectedNovaTab)) {
      confirm({
        title: '',
        msg: t('Nova.Alert.OverFileUploadSize', {
          max: getMaxFileSize(selectedNovaTab),
          min: MIN_FILE_UPLOAD_SIZE_KB
        })!,
        onOk: {
          text: t('Confirm'),
          callback: () => {
            return false;
          }
        }
      });
      return false;
    }
    return true;
  };

  interface getFileListProps {
    target: string;
    setState?: Dispatch<SetStateAction<'none' | 'request'>>;
    fileId?: DriveFileInfo['fileId'];
  }

  const getFileList = async (props: getFileListProps) => {
    const { target, setState, fileId } = props;

    try {
      if (setState) setState('request');
      const { res } = await apiWrapper().request(PO_DRIVE_LIST, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ fileId: fileId })
      });

      const {
        success,
        data: { list }
      } = await res.json();
      if (!success) throw new Error('failed to get file list');

      return list
        .filter(
          (item: DriveFileInfo) =>
            isValidFileSize(item.size, selectedNovaTab) || item.fileType === 'DIR'
        )
        .sort((l: DriveFileInfo, r: DriveFileInfo) =>
          l.fileType < r.fileType ? -1 : l.fileType > r.fileType ? 1 : 0
        )
        .map((item: DriveFileInfo) => {
          const ext = getFileExtension(item.fileName).toLowerCase();
          const supports =
            target === 'nova-image' ? getValidExt(selectedNovaTab) : SUPPORT_DOCUMENT_TYPE;
          console.log('supports', supports);
          const type = supports.find((type: SupportFileType) => type.extensions === ext)?.mimeType;

          return {
            ...item,
            name: item.fileName,
            type: type
          };
        })
        .filter((item: DriveFileInfo) => item.fileType === 'DIR' || !!item.type);
    } catch (err) {
      console.log(err);
      return []; // TODO : error handling
    } finally {
      if (setState) setState('none');
    }
  };

  const getFileInfo = async (fileId: string) => {
    try {
      const { res } = await apiWrapper().request(PO_DRIVE_FILEINFO, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ fileId: fileId })
      });

      const {
        success,
        data: { file }
      } = await res.json();
      if (!success) throw new Error('failed to get file list');

      const ext = getFileExtension(file.fileName).toLowerCase();
      const supports = [...getValidExt(selectedNovaTab), ...SUPPORT_DOCUMENT_TYPE];
      const type = supports.find((type: SupportFileType) => type.extensions === ext)?.mimeType;

      return {
        ...file,
        name: file.fileName,
        type: type
      };
    } catch (err) {
      return [];
    }
  };

  return {
    loadLocalFile,
    loadDriveFile,
    getFileList,
    getFileInfo,
    validateFileSize,
    validateCurFileSize,
    validateFileUpload,
    uploadTranslationFile
  };
}

export default useManageFile;
