import Button from 'components/buttons/Button';
import { VOICE_COLOR } from 'constants/voice-dictation';
import CheckDarkIcon from 'img/dark/nova/check_purple.svg';
import DownloadIcon from 'img/light/ico_download_white.svg';
import CheckLightIcon from 'img/light/nova/check_purple.svg';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';
import { themeInfoSelector } from 'store/slices/theme';
import { getLocalFiles } from 'store/slices/uploadFiles';
import { useAppSelector } from 'store/store';
import { css } from 'styled-components';
import { formatMilliseconds } from 'util/getAudioDuration';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import AudioPlayer from '../voice-audio-player';
import VoiceSaveBottomSheet from '../voice-save-bottom-sheet';

import * as S from './style';

export default function VoiceDictationResult() {
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const {
    sharedVoiceDictationInfo: { voiceDictationResult, audioDuration }
  } = useVoiceDictationContext();
  const localFiles = useAppSelector(getLocalFiles);

  const { t } = useTranslation();

  const handleOpenSaveOverlay = () => {
    overlay.open(({ isOpen, close }) => {
      return <VoiceSaveBottomSheet isOpened={isOpen} setIsOpened={close} />;
    });
  };

  return (
    <S.Wrapper>
      <S.Container>
        <S.Header>
          <S.Title lang={'ko'}>
            <img src={isLightMode ? CheckLightIcon : CheckDarkIcon} alt="check" />
            <span>{'받아쓰기 완료'}</span>
          </S.Title>

          <S.Description>
            음성 대화를 텍스트로 변환했어요. <br />
            대화 내용을 저장해, 자유롭게 활용해 보세요!
          </S.Description>
        </S.Header>

        <S.TranscriptContainer>
          <S.NewTranscript>
            <span>새로운 받아쓰기</span>
            <span>오늘 오후 10:57 · {audioDuration}</span>
          </S.NewTranscript>

          {voiceDictationResult?.data.segments.map((transcript, idx) => (
            <S.TranscriptItem key={idx} color={VOICE_COLOR[transcript.speaker.name]}>
              <S.TranscriptIcon color={VOICE_COLOR[transcript.speaker.name]}>
                참{transcript.speaker.label}
              </S.TranscriptIcon>
              <S.TranscriptContent>
                <S.TranscriptInfo>
                  <S.TranscriptName>참석자{transcript.speaker.name}</S.TranscriptName>
                  <S.TranscriptTime>{formatMilliseconds(transcript.end)}</S.TranscriptTime>
                </S.TranscriptInfo>
                <S.TranscriptText>{transcript.text}</S.TranscriptText>
              </S.TranscriptContent>
            </S.TranscriptItem>
          ))}
        </S.TranscriptContainer>

        <AudioPlayer
          // audioSource="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
          audioSource={localFiles[0]}
          onPlay={() => console.log('Started playing')}
          onPause={() => console.log('Paused')}
          onTimeUpdate={(time) => console.log('Current time:', time)}>
          {/* 호진FIXME: 아래 컴포넌트는 audio 로직과 떨어져있는게 맞는 것 같음! */}
          <S.ButtonWrapper>
            <Button
              variant="purple"
              width={'full'}
              height={48}
              cssExt={css`
                display: flex;
                gap: 4px;
                font-size: 16px;
                font-weight: 500;
                border-radius: 8px;
              `}
              onClick={handleOpenSaveOverlay}>
              <img src={DownloadIcon} alt="download" />
              <span>{t(`Nova.Result.Save`)}</span>
            </Button>
          </S.ButtonWrapper>
        </AudioPlayer>
      </S.Container>
    </S.Wrapper>
  );
}
