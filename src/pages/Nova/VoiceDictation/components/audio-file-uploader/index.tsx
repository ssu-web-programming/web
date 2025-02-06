import { useRef } from 'react';
import FileButton from 'components/FileButton';
import { getAccept } from 'components/nova/FileUploader';
import { AUDIO_SUPPORT_TYPE } from 'constants/fileTypes';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { ReactComponent as UploadDarkIcon } from 'img/dark/ico_upload_img_plus.svg';
import CreditIcon from 'img/light/ico_credit_gray.svg';
import { ReactComponent as UploadFileLightIcon } from 'img/light/nova/translation/file_upload.svg';
import { themeInfoSelector } from 'store/slices/theme';
import { getLocalFiles, setLocalFiles } from 'store/slices/uploadFiles';
import { userInfoSelector } from 'store/slices/userInfo';
import { useAppDispatch, useAppSelector } from 'store/store';
import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 206px;
  padding: 0 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background.gray01};
  border: 1px dashed ${({ theme }) => theme.color.border.gray01};
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
    color: ${({ theme }) => theme.color.text.subGray03};
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
    color: ${({ theme }) => theme.color.text.subGray03};
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
  handleUploadComplete: () => void;
  curTab: NOVA_TAB_TYPE;
  creditCount?: number;
  onNext?: () => void;
}

export default function AudioFileUploader({
  guideMsg,
  handleUploadComplete,
  curTab,
  creditCount = 10,
  onNext
}: ImageUploaderProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const dispatch = useAppDispatch();

  const localFiles = useAppSelector(getLocalFiles);

  console.log('localFiles', localFiles);

  const target = 'nova-voice-dictation';
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClickFileUpload = () => {
    // IOS는 팝업을 넣어야함!
    const element = inputRef?.current;
    if (element) {
      const targetType = AUDIO_SUPPORT_TYPE;
      element.accept = getAccept(targetType);
      element.multiple = false;
      element.click();
    }
  };

  return (
    <Wrap>
      <FileButton
        target={target}
        accept={getAccept(AUDIO_SUPPORT_TYPE)}
        ref={inputRef}
        onClick={handleClickFileUpload}
        handleOnChange={async (files) => {
          await dispatch(setLocalFiles(files));
          onNext?.();
        }}>
        <ImageBox>
          <Icon disable={isAgreed === undefined}>
            {isLightMode ? <UploadFileLightIcon /> : <UploadDarkIcon />}
            <span>음성 녹음 파일 업로드</span>
          </Icon>
          <Credit>
            <span>{creditCount}</span>
            <div className="img">
              <img src={CreditIcon} alt="credit" />
            </div>
          </Credit>
          <Guide>{guideMsg}</Guide>
        </ImageBox>
      </FileButton>
    </Wrap>
  );
}
