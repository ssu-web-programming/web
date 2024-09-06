import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import {
  MAX_FILE_UPLOAD_SIZE_MB,
  SUPPORT_DOCUMENT_TYPE,
  SUPPORT_IMAGE_TYPE,
  SupportFileType
} from '../../constants/fileTypes';
import ico_camera from '../../img/ico_camera.svg';
import ico_logo_po from '../../img/ico_logo_po.svg';
import ico_mobile from '../../img/ico_mobile.svg';
import ico_pc from '../../img/ico_pc.svg';
import { ReactComponent as DocsPlusIcon } from '../../img/ico_upload_docs_plus.svg';
import { ReactComponent as ImagePlusIcon } from '../../img/ico_upload_img_plus.svg';
import { ClientType, getPlatform } from '../../util/bridge';
import { getFileExtension } from '../../util/common';
import { useConfirm } from '../Confirm';
import DriveConfirm from '../DriveConfirm';
import FileButton from '../FileButton';
import { useChatNova } from '../hooks/useChatNova';
import useUserInfoUtils from '../hooks/useUserInfoUtils';
import PoDrive, { DriveFileInfo } from '../PoDrive';
import Tooltip from '../Tooltip';

export const flexCenter = css`
  display: flex;
  align-items: center;
`;

const UploadBtn = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;

  > button {
    width: 32px;
    height: 38px;
    ${flexCenter};
    justify-content: center;
  }
`;

type FileUploaderProps = {
  loadLocalFile: (files: File[]) => void;
  isAgreed: boolean | undefined;
  setIsAgreed: (agree: boolean) => void;
  onLoadDriveFile: (files: DriveFileInfo[]) => void;
};

export const FileUploader = (props: FileUploaderProps) => {
  const { loadLocalFile, isAgreed, setIsAgreed, onLoadDriveFile } = props;
  const { t } = useTranslation();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const { getAvailableFileCnt, calcAvailableFileCnt } = useUserInfoUtils();
  const inputDocsFileRef = useRef<HTMLInputElement | null>(null);
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<number>(0);
  const [uploadTarget, setUploadTarget] = useState<string>('');

  const toggleDriveConfirm = () => {
    setIsOpen(!isOpen);
  };

  const getCurrentFileInput = (target: string) => {
    if (target === 'nova-file') {
      return inputDocsFileRef;
    } else if (target === 'nova-image') {
      return inputImgFileRef;
    }
  };

  const TOOLTIP_UPLOAD_OPTION = (target: string) => {
    const options = [
      {
        name: t(`Nova.UploadTooltip.PolarisDrive`),
        icon: { src: ico_logo_po },
        onClick: async () => {
          if (isAgreed) {
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
          const element = getCurrentFileInput(target)?.current;
          if (element) {
            const targetType = target === 'nova-image' ? SUPPORT_IMAGE_TYPE : SUPPORT_DOCUMENT_TYPE;
            element.accept = getAccept(targetType);
            element.click();
          }
        }
      },
      {
        name: t(`Nova.UploadTooltip.Camera`),
        icon: { src: ico_camera },
        onClick: () => {
          const element = getCurrentFileInput(target)?.current;
          if (element) {
            element.accept = 'camera';
            element.click();
          }
        }
      }
    ];

    return target === 'nova-image' && getPlatform() === ClientType.android
      ? options
      : options.slice(0, 2);
  };

  const handleOnClick = () => {
    if (!isAgreed) {
      setIsAgreed(true);
    }
  };

  const UPLOAD_BTN_LIST = [
    {
      target: 'nova-file',
      accept: SUPPORT_DOCUMENT_TYPE,
      children: <DocsPlusIcon />,
      ref: inputDocsFileRef
    },
    {
      target: 'nova-image',
      accept: SUPPORT_IMAGE_TYPE,
      children: <ImagePlusIcon />,
      ref: inputImgFileRef
    }
  ];

  const handleDriveCancel = () => {
    toggleDriveConfirm();
    setUploadTarget('');
  };

  return (
    <UploadBtn>
      {UPLOAD_BTN_LIST.map((btn) => (
        <React.Fragment key={btn.target}>
          <Tooltip
            key={btn.target}
            placement="top-start"
            type="selectable"
            options={TOOLTIP_UPLOAD_OPTION(btn.target)}
            distance={10}
            condition={!!isAgreed}
            initPos>
            <FileButton
              target={btn.target}
              accept={getAccept(btn.accept)}
              handleOnChange={loadLocalFile}
              multiple
              isAgreed={isAgreed}
              handleOnClick={handleOnClick}
              ref={btn.ref}>
              {btn.children}
            </FileButton>
          </Tooltip>
        </React.Fragment>
      ))}

      {isOpen && (
        <DriveConfirm
          title={t('Nova.UploadTooltip.PolarisDrive')}
          msg={
            <>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  marginBottom: '24px'
                }}>
                {t(
                  calcAvailableFileCnt() >= 0
                    ? uploadTarget === 'nova-file'
                      ? 'Nova.PoDrive.LimitDesc'
                      : 'Nova.PoDrive.DescImg'
                    : 'Nova.PoDrive.Desc',
                  {
                    size: MAX_FILE_UPLOAD_SIZE_MB,
                    count: calcAvailableFileCnt()
                  }
                )}
              </div>

              <PoDrive
                max={calcAvailableFileCnt()}
                onChange={(files: DriveFileInfo[]) => onLoadDriveFile(files)}
                target={uploadTarget}
                handleSelectedFiles={(arg: number) => setSelectedFiles(arg)}
              />
            </>
          }
          onOk={{
            text: selectedFiles ? t('SelectionComplete') : t('Select'),
            callback: toggleDriveConfirm,
            disable: !selectedFiles
          }}
          onCancel={{ text: t('Cancel'), callback: handleDriveCancel }}
        />
      )}
    </UploadBtn>
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
