import Button from 'components/buttons/Button';
import OverlayModal from 'components/overlay-modal';
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
import PlaybackSpeedModalContent from '../modals/playback-speed-modal-content';
import AudioPlayer, { PlaybackSpeed } from '../voice-audio-player';
import VoiceSaveBottomSheet from '../voice-save-bottom-sheet';

import * as S from './style';

export default function VoiceDictationResult() {
  const {
    sharedVoiceDictationInfo: { voiceDictationResult, audioDuration }
  } = useVoiceDictationContext();
  const localFiles = useAppSelector(getLocalFiles);
  const { isLightMode } = useAppSelector(themeInfoSelector);

  const { t } = useTranslation();

  const handleOpenSaveOverlay = () => {
    overlay.open(({ isOpen, close }) => {
      return <VoiceSaveBottomSheet isOpened={isOpen} setIsOpened={close} />;
    });
  };

  const handleOpenPlaybackSpeed = (
    handleChangeSpeedOtions: (nextSpeed: PlaybackSpeed) => void,
    currentSpeed: PlaybackSpeed // 추가
  ) => {
    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={close}>
          <PlaybackSpeedModalContent
            onChangeSpeedOptions={handleChangeSpeedOtions}
            currentSpeed={currentSpeed} // 현재 속도 전달
          />
        </OverlayModal>
      );
    });
  };

  return (
    <S.Wrapper>
      <S.Container>
        <S.Header>
          <S.Title lang={'ko'}>
            <img src={isLightMode ? CheckLightIcon : CheckDarkIcon} alt="check" />
            <span>{t('Nova.voiceDictation.Status.Completed')}</span>
          </S.Title>

          <S.Description>{t('Nova.voiceDictation.Status.ConversionSuccess')}</S.Description>
        </S.Header>

        <S.TranscriptContainer>
          <S.NewTranscript>
            <span>{t('Nova.voiceDictation.Button.NewDictation')}</span>
            <span>오늘 오후 10:57 · {audioDuration}</span>
          </S.NewTranscript>

          {voiceDictationResult?.data.segments.map((transcript, idx) => (
            <S.TranscriptItem key={idx} color={VOICE_COLOR[transcript.speaker.name]}>
              <S.TranscriptIcon color={VOICE_COLOR[transcript.speaker.name]}>
                참{transcript.speaker.label}
              </S.TranscriptIcon>
              <S.TranscriptContent>
                <S.TranscriptInfo>
                  <S.TranscriptName>
                    {t('Nova.voiceDictation.Status.Participant')}
                    {transcript.speaker.name}
                  </S.TranscriptName>
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
          onTimeUpdate={(time) => console.log('Current time:', time)}
          isLightMode={isLightMode}
          openSpeedbackPopup={handleOpenPlaybackSpeed}>
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
