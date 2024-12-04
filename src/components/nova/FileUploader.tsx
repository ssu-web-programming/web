import React, { RefObject, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getValidExt, SUPPORT_DOCUMENT_TYPE, SupportFileType } from '../../constants/fileTypes';
import ico_camera from '../../img/ico_camera.svg';
import ico_insert_docs from '../../img/ico_insert_docs.svg';
import ico_logo_po from '../../img/ico_logo_po.svg';
import ico_mobile from '../../img/ico_mobile.svg';
import ico_pc from '../../img/ico_pc.svg';
import { setPageStatus } from '../../store/slices/nova/pageStatusSlice';
import { platformInfoSelector } from '../../store/slices/platformInfo';
import { NOVA_TAB_TYPE, selectTabSlice, setCreating } from '../../store/slices/tabSlice';
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
import { getFileExtension, isHigherVersion } from '../../util/common';
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
  onFinish?: () => void;
};

export const FileUploader = (props: FileUploaderProps) => {
  const { target, accept, children, inputRef, tooltipStyle, onFinish } = props;

  const { loadLocalFile, getFileInfo } = useManageFile(onFinish);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const { getAvailableFileCnt, calcAvailableFileCnt } = useUserInfoUtils();
  const currentFile = useAppSelector(getCurrentFile);
  const { platform, version } = useAppSelector(platformInfoSelector);

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
          const uploadLimit = calcAvailableFileCnt(selectedNovaTab);
          if (uploadLimit === 0 && selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
            setIsOpen(false);
            await confirm({
              title: '',
              msg: t('Nova.Confirm.OverMaxFileUploadCnt', {
                max: getAvailableFileCnt(selectedNovaTab)
              })!,
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
          src: platform === ClientType.android || platform === ClientType.ios ? ico_mobile : ico_pc
        },
        onClick: () => {
          const element = inputRef?.current;
          if (element) {
            const targetType =
              target === 'nova-image' ? getValidExt(selectedNovaTab) : SUPPORT_DOCUMENT_TYPE;
            element.accept = getAccept(targetType);
            // #IOS-5525 ios webp 파일 단일 선택 시 특정 버전에서 error가 발생하므로, 무조건 multiple로 지원하도록 수정함
            element.multiple =
              selectedNovaTab === NOVA_TAB_TYPE.aiChat || platform === ClientType.ios;

            element.click();
          }
        }
      }
    ];

    if (target === 'nova-image' && platform === ClientType.android) {
      options.push({
        name: t(`Nova.UploadTooltip.Camera`),
        icon: { src: ico_camera },
        onClick: () => {
          const element = getCurrentFileInput()?.current;
          if (element) {
            element.accept = 'camera';
            element.multiple = selectedNovaTab === NOVA_TAB_TYPE.aiChat;
            element.click();
          }
        }
      });
    }

    const supportedExtensions = SUPPORT_DOCUMENT_TYPE.flatMap((type) => type.extensions);
    if (
      target === 'nova-file' &&
      (currentFile.type === 'notSupported' ||
        (['drive', 'local'].includes(currentFile.type) &&
          supportedExtensions.includes(`.${currentFile.ext}`)))
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

    const uploadLimit = calcAvailableFileCnt(selectedNovaTab);
    if (uploadLimit === 0) {
      setIsOpen(false);
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFileUploadCnt', { max: getAvailableFileCnt(selectedNovaTab) })!,
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
    } else if (currentFile.type === 'local') {
      await confirmUploadFile();
    }
  };

  const confirmSaveDoc = async (isCancel: boolean) => {
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
  };

  const confirmUpload = async (url: string) => {
    if (platform === ClientType.windows) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.UpdateVersionWindows.Msg'),
        onOk: {
          text: t('Ok'),
          callback: () => {}
        }
      });
    } else {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.UpdateVersion.Msg'),
        onOk: {
          text: t('Nova.Confirm.UpdateVersion.Ok'),
          callback: () => {
            Bridge.callBridgeApi('openWindow', url);
          }
        },
        onCancel: {
          text: t('Nova.Confirm.UpdateVersion.Cancel'),
          callback: () => {}
        }
      });
    }
  };

  const getDownloadUrlByPlatform = () => {
    switch (platform) {
      case ClientType.android:
        return 'market://details?id=com.infraware.office.link';
      case ClientType.ios:
        return 'https://itunes.apple.com/app/polaris-office-pdf-docs/id698070860';
      case ClientType.windows:
        return 'https://polarisoffice.com/ko/download';
      case ClientType.mac:
        return 'itms-apps://itunes.apple.com/app/id1098211970?mt=12';
      default:
        return '';
    }
  };

  const isUpdateRequired = () => {
    if (platform === ClientType.web || platform === ClientType.unknown) return false;
    if (selectedNovaTab != NOVA_TAB_TYPE.convert2DTo3D) return false;

    type ClientType = 'android' | 'ios' | 'windows' | 'mac';
    const versionMap: Record<ClientType, string> = {
      android: '9.9.5',
      ios: '9.8.6',
      windows: '10.105.250.54114',
      mac: '9.0.64'
    };
    return !isHigherVersion(versionMap[platform as keyof typeof versionMap], version);
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
          initPos
          style={tooltipStyle}
          onClick={() => {
            if (isUpdateRequired()) {
              const url = getDownloadUrlByPlatform();
              confirmUpload(url);
              return;
            }
          }}>
          <FileButton
            target={target}
            accept={getAccept(accept)}
            handleOnChange={(files) => {
              loadLocalFile(files);
            }}
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
