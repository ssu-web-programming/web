import React, { RefObject, useState } from 'react';
import useCurrentDocAnalysis from 'components/hooks/use-current-doc-analysis';
import { OriginalFileType } from 'pages/Nova/Translation/provider/translation-provider';
import { useTranslation } from 'react-i18next';

import {
  getValidExt,
  SUPPORT_DOCUMENT_TYPE,
  SupportFileType,
  TRANSLATION_SUPPORT_TYPE
} from '../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';
import { getDownloadUrlByPlatform } from '../../constants/platform';
import InsertDocsDarkIcon from '../../img/dark/ico_insert_docs.svg';
import MobileDarkIcon from '../../img/dark/ico_mobile.svg';
import PCDarkIcon from '../../img/dark/ico_pc.svg';
import CameraLightIcon from '../../img/light/ico_camera.svg';
import InsertDocsLightIcon from '../../img/light/ico_insert_docs.svg';
import LogoPOIcon from '../../img/light/ico_logo_po.svg';
import MobileLightIcon from '../../img/light/ico_mobile.svg';
import PCLightIcon from '../../img/light/ico_pc.svg';
import { novaHistorySelector } from '../../store/slices/nova/novaHistorySlice';
import { platformInfoSelector } from '../../store/slices/platformInfo';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { themeInfoSelector } from '../../store/slices/theme';
import { getCurrentFile } from '../../store/slices/uploadFiles';
import { userInfoSelector } from '../../store/slices/userInfo';
import { useAppSelector } from '../../store/store';
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
  target: 'nova-image' | 'nova-translation' | string;
  accept: SupportFileType[];
  children: React.ReactNode;
  inputRef: RefObject<HTMLInputElement>;
  tooltipStyle?: React.CSSProperties;
  onFinish?: () => void;
  onClearPastedImages?: () => void;
  type?: 'image' | 'file';
  maxFileSize?: number;
  onChangeTranslationFileType?: (type: OriginalFileType) => void;
};

export const FileUploader = (props: FileUploaderProps) => {
  const {
    target,
    accept,
    children,
    inputRef,
    tooltipStyle,
    onFinish,
    onClearPastedImages,
    type = 'image',
    maxFileSize = 30 * 1024 * 1024,
    onChangeTranslationFileType
  } = props;

  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const { getAvailableFileCnt, calcAvailableFileCnt } = useUserInfoUtils();
  const novaHistory = useAppSelector(novaHistorySelector);
  const currentFile = useAppSelector(getCurrentFile);
  const { platform, version } = useAppSelector(platformInfoSelector);

  const [isOpen, setIsOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string>('');
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const { analysisCurDoc } = useCurrentDocAnalysis();
  const { loadLocalFile, uploadTranslationFile } = useManageFile({
    onFinishCallback: onFinish,
    onClearPastedImages
  });

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
        icon: { src: LogoPOIcon },
        onClick: async () => {
          onChangeTranslationFileType?.('drive');
          if (
            isAgreed ||
            (selectedNovaTab !== NOVA_TAB_TYPE.aiChat && selectedNovaTab !== NOVA_TAB_TYPE.home)
          ) {
            setUploadTarget(target);
            toggleDriveConfirm();
          }
          const uploadLimit = calcAvailableFileCnt(selectedNovaTab);
          if (
            uploadLimit === 0 &&
            (selectedNovaTab === NOVA_TAB_TYPE.home || selectedNovaTab === NOVA_TAB_TYPE.aiChat)
          ) {
            setIsOpen(false);
            await confirm({
              title: '',
              msg: t('Nova.Confirm.OverMaxFileUploadCnt', {
                max: getAvailableFileCnt(selectedNovaTab)
              })!,
              onOk: {
                text: t('Nova.Confirm.NewChat.StartNewChat'),
                callback: () => chatNova.newChat(selectedNovaTab, novaHistory)
              },
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
            platform === ClientType.android || platform === ClientType.ios
              ? isLightMode
                ? MobileLightIcon
                : MobileDarkIcon
              : isLightMode
                ? PCLightIcon
                : PCDarkIcon
        },
        onClick: () => {
          onChangeTranslationFileType?.('drive');
          const element = inputRef?.current;
          if (element) {
            const targetType =
              target === 'nova-image'
                ? getValidExt(selectedNovaTab)
                : target === 'nova-translation'
                  ? TRANSLATION_SUPPORT_TYPE
                  : SUPPORT_DOCUMENT_TYPE;

            // element.accept = getAccept(targetType);
            element.accept = 'image/jpg, image/png, image/jpeg';
            console.log('getAccept(targetType)', getAccept(targetType));
            console.log('DEBUG: platform =', platform);
            console.log('DEBUG: navigator.userAgent =', navigator.userAgent);
            console.log('DEBUG: targetType =', targetType);

            // #IOS-5525 ios webp 파일 단일 선택 시 특정 버전에서 error가 발생하므로, 무조건 multiple로 지원하도록 수정함
            element.multiple =
              selectedNovaTab === NOVA_TAB_TYPE.home ||
              selectedNovaTab === NOVA_TAB_TYPE.aiChat ||
              platform === ClientType.ios;

            element.click();
          }
        }
      }
    ];

    if (target === 'nova-image' && platform === ClientType.android) {
      options.push({
        name: t(`Nova.UploadTooltip.Camera`),
        icon: { src: CameraLightIcon },
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
      (target === 'nova-file' || target === 'nova-translation') &&
      (currentFile.type === 'notSupported' ||
        (['drive', 'local'].includes(currentFile.type) &&
          supportedExtensions.includes(`.${currentFile.ext}`)))
    ) {
      options.push({
        name:
          target === 'nova-translation'
            ? t(`Nova.UploadTooltip.TranslationCurrentFile`)
            : t(`Nova.UploadTooltip.CurrentFile`),
        icon: { src: isLightMode ? InsertDocsLightIcon : InsertDocsDarkIcon },
        onClick: async () => {
          onChangeTranslationFileType?.('currentDoc');
          await analysisCurDoc();
        }
      });
    }

    return options;
  };

  const confirmUpload = async () => {
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
            Bridge.callBridgeApi('openWindow', getDownloadUrlByPlatform(platform));
          }
        },
        onCancel: {
          text: t('Nova.Confirm.UpdateVersion.Cancel'),
          callback: () => {}
        }
      });
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
              confirmUpload();
              return;
            }
          }}>
          <FileButton
            target={target}
            // accept={getAccept(accept)}
            accept="image/jpg, image/png, image/jpeg"
            handleOnChange={(files) => {
              type === 'file' ? uploadTranslationFile(files, maxFileSize) : loadLocalFile(files);
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
          onClearPastedImages={onClearPastedImages}
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
