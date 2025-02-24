import { useRef } from 'react';
import FileButton from 'components/FileButton';
import { getAccept } from 'components/nova/FileUploader';
import GuideBox from 'components/nova/guide-box';
import { AUDIO_SUPPORT_TYPE } from 'constants/fileTypes';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { ReactComponent as UploadDarkIcon } from 'img/dark/ico_upload_img_plus.svg';
import { ReactComponent as UploadFileLightIcon } from 'img/light/nova/translation/file_upload.svg';
import { useTranslation } from 'react-i18next';
import { setLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch } from 'store/store';
import { formatDuration, getAudioDuration } from 'util/getAudioDuration';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';

import * as S from './style';

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
  const { setSharedVoiceDictationInfo } = useVoiceDictationContext();
  const dispatch = useAppDispatch();

  const target = 'nova-voice-dictation';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

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

  const audioDuration = async (file: File) => {
    try {
      const duration = await getAudioDuration(file);
      setSharedVoiceDictationInfo((prev) => ({
        ...prev,
        audioDuration: formatDuration(duration)
      }));
    } catch (e) {
      console.log('터짐', e);
    }
  };

  return (
    <S.Wrap>
      <FileButton
        target={target}
        accept={getAccept(AUDIO_SUPPORT_TYPE)}
        ref={inputRef}
        onClick={handleClickFileUpload}
        handleOnChange={async (files) => {
          await dispatch(setLocalFiles(files));
          await audioDuration(files[0]);
          onNext?.();
        }}>
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
