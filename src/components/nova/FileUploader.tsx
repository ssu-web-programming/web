import React, { RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getValidExt, SUPPORT_DOCUMENT_TYPE, SupportFileType } from '../../constants/fileTypes';
import ico_camera from '../../img/ico_camera.svg';
import ico_insert_docs from '../../img/ico_insert_docs.svg';
import ico_logo_po from '../../img/ico_logo_po.svg';
import ico_mobile from '../../img/ico_mobile.svg';
import ico_pc from '../../img/ico_pc.svg';
import { setPageStatus } from '../../store/slices/nova/pageStatusSlice';
import { selectTabSlice, setCreating } from '../../store/slices/tabSlice';
import {
  getCurrentFile,
  removeLoadingFile,
  setDriveFiles,
  setLoadingFile,
  setLocalFiles
} from '../../store/slices/uploadFiles';
import { userInfoSelector } from '../../store/slices/userInfo';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge, { ClientType, getPlatform } from '../../util/bridge';
import { getFileExtension } from '../../util/common';
import { useConfirm } from '../Confirm';
import FileButton from '../FileButton';
import useManageFile from '../hooks/nova/useManageFile';
import { useChatNova } from '../hooks/useChatNova';
import useUserInfoUtils from '../hooks/useUserInfoUtils';
import Tooltip from '../Tooltip';

import PODriveList from './PODirveList';

type FileUploaderProps = {
  target: string;
  accept: SupportFileType[];
  children: React.ReactNode;
  inputRef: RefObject<HTMLInputElement>;
  tooltipStyle?: React.CSSProperties;
};

export const FileUploader = (props: FileUploaderProps) => {
  const { target, accept, children, inputRef, tooltipStyle } = props;

  const { loadLocalFile } = useManageFile();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const platform = getPlatform();
  const chatNova = useChatNova();
  const { getAvailableFileCnt, calcAvailableFileCnt } = useUserInfoUtils();
  const currentFile = useAppSelector(getCurrentFile);
  const { getFileInfo } = useManageFile();

  const [isOpen, setIsOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string>('');
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const toggleDriveConfirm = () => {
    setIsOpen(!isOpen);
  };

  const getCurrentFileInput = () => {
    return inputRef;
  };

  const TOOLTIP_UPLOAD_OPTION = (target: string) => {
    const options = [
      {
        name: t(`Nova.UploadTooltip.PolarisDrive`),
        icon: { src: ico_logo_po },
        onClick: async () => {
          if (isAgreed || selectedNovaTab !== 'aiChat') {
            setUploadTarget(target);
            toggleDriveConfirm();
          }
          const uploadLimit = calcAvailableFileCnt();
          if (uploadLimit === 0) {
            setIsOpen(false);
            await confirm({
              title: '',
              msg: t('Nova.Confirm.OverMaxFileUploadCnt', { max: getAvailableFileCnt() })!,
              onOk: { text: t('Nova.Confirm.NewChat.StartNewChat'), callback: chatNova.newChat },
              onCancel: {
                text: t('Cancel'),
                callback: () => {}
              }
            });
            return;
          }
        }
      },
      {
        name: t(`Nova.UploadTooltip.Local`),
        icon: {
          src:
            getPlatform() === ClientType.android || getPlatform() === ClientType.ios
              ? ico_mobile
              : ico_pc
        },
        onClick: () => {
          const element = inputRef?.current;
          if (element) {
            const targetType =
              target === 'nova-image' ? getValidExt(selectedNovaTab) : SUPPORT_DOCUMENT_TYPE;
            element.accept = getAccept(targetType);
            element.click();
          }
        }
      }
    ];

    if (target === 'nova-image' && getPlatform() === ClientType.android) {
      options.push({
        name: t(`Nova.UploadTooltip.Camera`),
        icon: { src: ico_camera },
        onClick: () => {
          const element = getCurrentFileInput()?.current;
          if (element) {
            element.accept = 'camera';
            element.click();
          }
        }
      });
    }

    const supportedExtensions = SUPPORT_DOCUMENT_TYPE.flatMap((type) => type.extensions);
    if (
      target === 'nova-file' &&
      currentFile.type !== 'new' &&
      currentFile.type !== 'unknown' &&
      supportedExtensions.includes(`.${currentFile.ext}`)
    ) {
      options.push({
        name: t(`Nova.UploadTooltip.CurrentFile`),
        icon: { src: ico_insert_docs },
        onClick: async () => {
          await analysisCurDoc();
        }
      });
    }

    return options;
  };

  const analysisCurDoc = async () => {
    if (isAgreed) {
      setUploadTarget(target);
    }

    const uploadLimit = calcAvailableFileCnt();
    if (uploadLimit === 0) {
      setIsOpen(false);
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFileUploadCnt', { max: getAvailableFileCnt() })!,
        onOk: { text: t('Nova.Confirm.NewChat.StartNewChat'), callback: chatNova.newChat },
        onCancel: {
          text: t('Cancel'),
          callback: () => {
            dispatch(setCreating('none'));
          }
        }
      });
      return;
    }

    if (currentFile.type === 'notSupported') {
      await confirm({
        title: '',
        msg: t('Nova.Alert.UnopenableDocError', { max: getAvailableFileCnt() })!,
        onOk: {
          text: t('Confirm'),
          callback: () => {
            dispatch(setCreating('none'));
          }
        }
      });
    } else if (currentFile.type === 'drive') {
      if (currentFile.isSaved) {
        dispatch(setCreating('NOVA'));
        dispatch(setLocalFiles([]));
        dispatch(setDriveFiles([]));

        dispatch(setLoadingFile({ id: currentFile.id }));
        const curFile = await getFileInfo(currentFile.id);
        dispatch(removeLoadingFile());

        dispatch(setDriveFiles([curFile]));
        dispatch(setCreating('none'));
      } else {
        await confirm({
          title: '',
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
          onCancel: {
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
      }
    } else if (currentFile.type === 'local') {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.UploadFile.Msg'),
        onOk: {
          text: t('Nova.Confirm.UploadFile.Ok'),
          callback: () => {
            dispatch(setPageStatus({ tab: selectedNovaTab, status: 'progress' }));
            Bridge.callBridgeApi('uploadFile');
          }
        },
        onCancel: {
          text: t('Cancel'),
          callback: () => {}
        }
      });
    }
  };

  return (
    <>
      <React.Fragment key={target}>
        <Tooltip
          key={target}
          placement="top-start"
          type="selectable"
          options={TOOLTIP_UPLOAD_OPTION(target)}
          distance={10}
          condition={!!isAgreed}
          initPos
          style={tooltipStyle}>
          <FileButton
            target={target}
            accept={getAccept(accept)}
            handleOnChange={(files) => loadLocalFile(files)}
            multiple
            ref={inputRef}>
            {children}
          </FileButton>
        </Tooltip>
      </React.Fragment>

      {isOpen && (
        <PODriveList
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          uploadTarget={uploadTarget}
          setUploadTarget={setUploadTarget}
        />
      )}
    </>
  );
};

export const getAccept = (infos: SupportFileType[] | File) => {
  // web = extensioin, others = mimeType
  const platform = getPlatform();
  if (infos instanceof File) {
    if (platform === ClientType.unknown) {
      return getFileExtension(infos.name.toLowerCase());
    } else {
      return infos.type;
    }
  } else {
    if (platform === ClientType.unknown) {
      return infos.map((type) => type.extensions).join(',');
    } else {
      return infos.map((type) => type.mimeType).join(',');
    }
  }
};
