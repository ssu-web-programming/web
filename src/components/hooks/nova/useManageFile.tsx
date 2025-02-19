import { Dispatch, SetStateAction } from 'react';
import { useConfirm } from 'components/Confirm';
import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { PO_DRIVE_FILEINFO, PO_DRIVE_LIST } from '../../../api/constant';
import {
  ALLOWED_MIME_TYPES,
  getMaxFileSize,
  getValidExt,
  isValidFileSize,
  MIN_FILE_UPLOAD_SIZE_KB,
  SUPPORT_DOCUMENT_TYPE,
  SupportFileType,
  TRANSLATION_SUPPORT_TYPE
} from '../../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { novaHistorySelector } from '../../../store/slices/nova/novaHistorySlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { DriveFileInfo, setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
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

      // 파일 타입 검사
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
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

  const validateFileUpload = async (files: File[], maxFileSize: number) => {
    const validation = validateFiles(files, maxFileSize);

    // 실패했을때 나오는 팝업!
    if (validation.invalidReason.type.length > 0) {
      await confirm({
        msg: '지원하지 않는 파일 형식입니다. 다시 한 번 확인해 주세요.'
      });
      return;
    }

    if (validation.invalidReason.size.length > 0) {
      await confirm({
        msg: `파일의 크기가 너무 큽니다. 30MB 이하의 파일만 선택해주세요.`
      });
      return;
    }

    // 성공했을때는 localFiles에 넣는다.
    dispatch(setLocalFiles(files));
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
      selectedNovaTab === 'aiChat'
        ? [
            ...SUPPORT_DOCUMENT_TYPE.flatMap((type) => type.extensions),
            ...getValidExt(selectedNovaTab).flatMap((type) => type.extensions)
          ]
        : selectedNovaTab === 'translation'
          ? [
              ...TRANSLATION_SUPPORT_TYPE.flatMap((type) => type.extensions),
              ...getValidExt(selectedNovaTab).flatMap((type) => type.extensions)
            ]
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
          selectedNovaTab === 'aiChat'
            ? t('Nova.Alert.CommonUnsupportFile')
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
          callback: () => {}
        }
      });
      return;
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
    validateFileUpload
  };
}

export default useManageFile;
