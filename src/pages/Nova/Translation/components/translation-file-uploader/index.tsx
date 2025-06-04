import { useRef } from 'react';
import { FileUploader } from 'components/nova/FileUploader';
import { TRANSLATION_SUPPORT_TYPE } from 'constants/fileTypes';
import { ReactComponent as UploadDarkIcon } from 'img/dark/ico_upload_img_plus.svg';
import { ReactComponent as CreditIcon } from 'img/light/ico_credit_gray.svg';
import { ReactComponent as UploadFileLightIcon } from 'img/light/nova/translation/file_upload.svg';
import { useTranslation } from 'react-i18next';
import { themeInfoSelector } from 'store/slices/theme';
import { getDriveFiles, getLocalFiles } from 'store/slices/uploadFiles';
import { userInfoSelector } from 'store/slices/userInfo';
import { useAppSelector } from 'store/store';
import styled from 'styled-components';

import FileItem from '../../../../../components/nova/file-item';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { OriginalFileType, useTranslationContext } from '../../provider/translation-provider';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 206px;
  padding: 0 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.subBgGray01};
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
    color: ${(props) =>
      props.disable ? props.theme.color.text.gray03 : props.theme.color.text.gray03};
  }

  span {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

const Credit = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 2px 2px 12px;
  background: ${({ theme }) => theme.color.background.gray02};
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
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

const StyledCreditIcon = styled(CreditIcon)`
  & path {
    fill: ${({ theme }) => theme.color.text.gray02};
  }
`;

const Guide = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #9ea4aa;
  white-space: pre-wrap;
  text-align: center;
`;

interface ImageUploaderProps {
  guideMsg: string;
  curTab: NOVA_TAB_TYPE;
  creditCount?: number;
}

export default function TranslationFileUploader({
  guideMsg,
  creditCount = 10
}: ImageUploaderProps) {
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);
  const { t } = useTranslation();

  const { setSharedTranslationInfo } = useTranslationContext();

  const handleChangeOriginalFileType = (type: OriginalFileType) => {
    setSharedTranslationInfo((prev) => ({
      ...prev,
      originalFileType: type
    }));
  };

  const getActiveFile = () => {
    if (localFiles.length > 0) return localFiles[0];
    if (driveFiles.length > 0) return driveFiles[0];

    return null;
  };

  return (
    <Wrap>
      {getActiveFile() ? (
        <FileItem fileName={getActiveFile()?.name} iconSize={64} />
      ) : (
        <FileUploader
          type="file"
          key={'nova-translation'}
          target={'nova-translation'}
          accept={TRANSLATION_SUPPORT_TYPE}
          inputRef={inputImgFileRef}
          tooltipStyle={{
            minWidth: '165px',
            top: '8px',
            left: 'unset',
            right: 'unset',
            bottom: 'unset',
            padding: '12px 16px'
          }}
          onChangeTranslationFileType={handleChangeOriginalFileType}>
          <ImageBox>
            <Icon disable={isAgreed === undefined}>
              {isLightMode ? <UploadFileLightIcon /> : <UploadDarkIcon />}
              <span>{t('Nova.translation.FileUpload.Guide.Title')}</span>
            </Icon>
            <Credit>
              <span>{creditCount}</span>
              <div className="img">
                <StyledCreditIcon />
              </div>
            </Credit>
            <Guide>{guideMsg}</Guide>
          </ImageBox>
        </FileUploader>
      )}
    </Wrap>
  );
}
