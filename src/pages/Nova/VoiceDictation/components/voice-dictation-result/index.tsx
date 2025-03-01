import { useEffect } from 'react';
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

import useErrorHandle from '../../../../../components/hooks/useErrorHandle';
import SurveyModalContent from '../../../../../components/nova/satisfactionSurvey/survey-modal-content';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { selectPageCreditReceived } from '../../../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../../../store/slices/tabSlice';
import { getCookie } from '../../../../../util/common';
import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import PlaybackSpeedModalContent from '../modals/playback-speed-modal-content';
// AudioPlayer 컴포넌트와 타입 임포트 업데이트
import CustomAudioPlayer, { PlaybackSpeed } from '../voice-audio-player';
import VoiceSaveBottomSheet from '../voice-save-bottom-sheet';

import * as S from './style';

export default function VoiceDictationResult() {
  const {
    sharedVoiceDictationInfo: { voiceDictationResult, audioDuration, currentTime }
  } = useVoiceDictationContext();
  const localFiles = useAppSelector(getLocalFiles);
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const errorHandle = useErrorHandle();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(NOVA_TAB_TYPE.translation));

  const { t } = useTranslation();

  useEffect(() => {
    // showSurveyModal();
  }, []);

  const handleOpenSaveOverlay = () => {
    overlay.open(({ isOpen, close }) => {
      return <VoiceSaveBottomSheet isOpened={isOpen} setIsOpened={close} />;
    });
  };

  const handleOpenPlaybackSpeed = (
    handleChangeSpeedOtions: (nextSpeed: PlaybackSpeed) => void,
    currentSpeed: PlaybackSpeed
  ) => {
    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={close}>
          <PlaybackSpeedModalContent
            onChangeSpeedOptions={handleChangeSpeedOtions}
            currentSpeed={currentSpeed}
          />
        </OverlayModal>
      );
    });
  };

  const showSurveyModal = async () => {
    // 만족도 이벤트
    if (!isCreditRecieved && !getCookie(`dontShowSurvey${selectedNovaTab}`)) {
      overlay.closeAll();

      overlay.open(({ isOpen, close }) => {
        return (
          <OverlayModal isOpen={isOpen} onClose={close}>
            <SurveyModalContent />
          </OverlayModal>
        );
      });
    }
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
            <span>
              {currentTime} · {audioDuration}
            </span>
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
                  <S.TranscriptTime>{formatMilliseconds(transcript.start)}</S.TranscriptTime>
                </S.TranscriptInfo>
                <S.TranscriptText>{transcript.text}</S.TranscriptText>
              </S.TranscriptContent>
            </S.TranscriptItem>
          ))}
        </S.TranscriptContainer>

        {/* CustomAudioPlayer로 컴포넌트 이름 변경 */}
        <CustomAudioPlayer
          audioSource={localFiles[0]}
          onPlay={() => console.log('Started playing')}
          onPause={() => console.log('Paused')}
          isLightMode={isLightMode}
          openSpeedbackPopup={handleOpenPlaybackSpeed}>
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
        </CustomAudioPlayer>
      </S.Container>
    </S.Wrapper>
  );
}
