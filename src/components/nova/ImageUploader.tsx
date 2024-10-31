import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { compressImage, SUPPORT_IMAGE_TYPE } from '../../constants/fileTypes';
import CreditIcon from '../../img/ico_credit_gray.svg';
import { ReactComponent as UploadIcon } from '../../img/ico_upload_img_plus.svg';
import { selectPageData, setPageData } from '../../store/slices/nova/pageStatusSlice';
import { platformInfoSelector } from '../../store/slices/platformInfo';
import { NOVA_TAB_TYPE } from '../../store/slices/tabSlice';
import { getDriveFiles, getLocalFiles } from '../../store/slices/uploadFiles';
import { userInfoSelector } from '../../store/slices/userInfo';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge, { ClientType } from '../../util/bridge';
import { isHigherVersion } from '../../util/common';
import { convertDriveFileToFile } from '../../util/files';
import { useConfirm } from '../Confirm';

import { FileUploader } from './FileUploader';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 206px;
  padding: 0 16px;
  border: 1px dashed #c9cdd2;
  border-radius: 8px;
  background-color: white;
`;

const ImageBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Icon = styled.div<{ disable: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    width: 48px;
    height: 48px;

    cursor: ${(props) => (props.disable ? 'initial' : 'pointer')};
    color: ${(props) => (props.disable ? '#454c5380' : 'var(--gray-gray-80-02)')};
  }

  span {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #454c53;
  }
`;

const Credit = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 2px 2px 12px;
  background: #f2f4f6;
  border-radius: 999px;

  .img {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 2px;
    color: #454c53;
  }
`;

const Guide = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #9ea4aa;
  white-space: break-spaces;
  text-align: center;
`;

interface ImageUploaderProps {
  guideMsg: string;
  handleUploadComplete: () => void;
  curTab: NOVA_TAB_TYPE;
}

export default function ImageUploader(props: ImageUploaderProps) {
  const { t } = useTranslation();
  const { platform, version } = useAppSelector(platformInfoSelector);
  const confirm = useConfirm();
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);
  const currentFile = useAppSelector(selectPageData(props.curTab));
  const target = 'nova-image';

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
    console.log('platform: ', platform);
    console.log('version: ', version);
    if (platform === ClientType.web || platform === ClientType.unknown) return false;

    type ClientType = 'android' | 'ios' | 'windows' | 'mac';
    const versionMap: Record<ClientType, string> = {
      android: '9.9.5',
      ios: '9.8.6',
      windows: '10.105.250.54114',
      mac: '9.0.63'
    };

    return !isHigherVersion(versionMap[platform as keyof typeof versionMap], version);
  };

  const confirmUpload = async (url: string) => {
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
  };

  const handleFileProcessing = async () => {
    const selectedFile = localFiles[0] || driveFiles[0];
    if (!selectedFile) return;

    if (props.curTab === NOVA_TAB_TYPE.convert2DTo3D && isUpdateRequired()) {
      const url = getDownloadUrlByPlatform();
      await confirmUpload(url);
      return;
    }

    console.log('selectedFile: ', selectedFile);
    const fileData = await compressImage(await convertDriveFileToFile(selectedFile), props.curTab);
    dispatch(
      setPageData({
        tab: props.curTab,
        data: fileData
      })
    );
  };

  useEffect(() => {
    if (currentFile) {
      props.handleUploadComplete();
    } else {
      handleFileProcessing();
    }
  }, [localFiles, driveFiles, currentFile, props.curTab]);

  return (
    <Wrap>
      <FileUploader
        key={target}
        target={target}
        accept={SUPPORT_IMAGE_TYPE}
        inputRef={inputImgFileRef}
        tooltipStyle={{
          minWidth: '165px',
          top: '12px',
          left: 'unset',
          right: 'unset',
          bottom: 'unset',
          padding: '12px 16px'
        }}>
        <ImageBox>
          <Icon disable={isAgreed === undefined}>
            <UploadIcon />
            <span>{t(`Nova.UploadTooltip.UploadImage`)}</span>
          </Icon>
          <Credit>
            <span>10</span>
            <div className="img">
              <img src={CreditIcon} alt="credit" />
            </div>
          </Credit>
          <Guide>{props.guideMsg}</Guide>
        </ImageBox>
      </FileUploader>
    </Wrap>
  );
}
