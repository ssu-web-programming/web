import { useRef } from 'react';
import { useConfirm } from 'components/Confirm';
import FileButton from 'components/FileButton';
import useManageFile from 'components/hooks/nova/useManageFile';
import { getAccept } from 'components/nova/FileUploader';
import GuideBox from 'components/nova/guide-box';
import { AUDIO_SUPPORT_TYPE } from 'constants/fileTypes';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { ReactComponent as UploadDarkIcon } from 'img/dark/ico_upload_img_plus.svg';
import { ReactComponent as UploadFileLightIcon } from 'img/light/nova/translation/file_upload.svg';
import { useTranslation } from 'react-i18next';
import { ClientType, platformInfoSelector } from 'store/slices/platformInfo';
import { useAppSelector } from 'store/store';
import { getCookie } from 'util/common';

import * as S from './style';

interface ImageUploaderProps {
  guideMsg: string;
  handleUploadComplete: () => void;
  curTab: NOVA_TAB_TYPE;
  creditCount?: number;
  onNext?: () => void;
}

export default function AudioFileUploader({ guideMsg }: ImageUploaderProps) {
  const { platform } = useAppSelector(platformInfoSelector);
  const confirm = useConfirm();

  const target = 'nova-voice-dictation';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  const handleUpload = () => {
    const element = inputRef?.current;
    if (element) {
      const targetType = AUDIO_SUPPORT_TYPE;
      element.accept = getAccept(targetType);
      element.multiple = false;
      element.click();
    }
  };

  const handleClickFileUpload = async () => {
    const iosRecordDontWatchAgain = !!getCookie('iosRecordDontWatchAgain');

    // iOS 플랫폼이고 '다시 보지 않기' 설정이 없는 경우에만 확인 창 표시
    if (platform === ClientType.ios && !iosRecordDontWatchAgain) {
      await confirm({
        title: t('Nova.voiceDictation.Alert.iPhoneGuideTitle') as string,
        msg: t('Nova.voiceDictation.Alert.iPhoneGuideContent'),
        onOk: {
          text: t('Nova.voiceDictation.Button.Confirm') as string,
          callback: () => {
            handleUpload();
          }
        },
        neverShowAgain: true,
        cookieName: 'iosRecordDontWatchAgain',
        expiredDuration: 52600
      });
    } else {
      // iOS가 아니거나 이미 '다시 보지 않기'를 선택한 경우 바로 업로드
      handleUpload();
    }
  };

  const { loadLocalFile } = useManageFile({});

  const handleChange = async (files: File[]) => {
    await loadLocalFile(files);
  };

  return (
    <S.Wrap>
      <FileButton
        target={target}
        accept={getAccept(AUDIO_SUPPORT_TYPE)}
        ref={inputRef}
        onClick={handleClickFileUpload}
        handleOnChange={handleChange}>
        <GuideBox
          guideMsg={guideMsg}
          guideTitle={t('Nova.voiceDictation.Button.UploadFile')}
          lightIcon={<UploadFileLightIcon />}
          darkIcon={<UploadDarkIcon />}
          creditCount={50}
        />
      </FileButton>
    </S.Wrap>
  );
}
