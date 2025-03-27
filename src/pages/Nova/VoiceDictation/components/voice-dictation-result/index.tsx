import { useCallback, useEffect, useState } from 'react';
import Button from 'components/buttons/Button';
import IconTextButton from 'components/buttons/IconTextButton';
import { useInsertDocsHandler } from 'components/hooks/nova/useInsertDocsHandler';
import { useCopyToClipboard } from 'components/hooks/useCopyToClipboard';
import OverlayModal from 'components/overlay-modal';
import { VOICE_COLOR } from 'constants/voice-dictation';
import CheckDarkIcon from 'img/dark/nova/check_purple.svg';
import copyDarkIcon from 'img/dark/nova/translation/copy.svg';
import insertDarkDocIcon from 'img/dark/nova/translation/insert_docs.svg';
import DownloadIcon from 'img/light/ico_download_white.svg';
import CheckLightIcon from 'img/light/nova/check_purple.svg';
import copyIcon from 'img/light/nova/translation/copy.svg';
import insertDocIcon from 'img/light/nova/translation/insert_docs.svg';
import { overlay } from 'overlay-kit';
import { ClientStatusType } from 'pages/Nova/Nova';
import { useTranslation } from 'react-i18next';
import { themeInfoSelector } from 'store/slices/theme';
import { useAppDispatch, useAppSelector } from 'store/store';
import { css } from 'styled-components';
import Bridge from 'util/bridge';
import { formatMilliseconds } from 'util/getAudioDuration';
import { parseJsonToText } from 'util/voice-dictation';

import UseShowSurveyModal from '../../../../../components/hooks/use-survey-modal';
import {
  selectPageCreditReceived,
  selectPageService,
  setPageServiceUsage
} from '../../../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../../../store/slices/tabSlice';
import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';
import PlaybackSpeedModalContent from '../modals/playback-speed-modal-content';
// AudioPlayer 컴포넌트와 타입 임포트 업데이트
import AudioPlayer, { PlaybackSpeed } from '../voice-audio-player';
import VoiceSaveBottomSheet from '../voice-save-bottom-sheet';

import * as S from './style';

export default function VoiceDictationResult() {
  const {
    sharedVoiceDictationInfo: { voiceDictationResult, audioDuration, currentTime }
  } = useVoiceDictationContext();
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(selectedNovaTab));
  const { copyText } = useCopyToClipboard();

  const [clientStatus, setClientStatus] = useState<ClientStatusType>('doc_edit_mode');
  const { insertDocsHandler } = useInsertDocsHandler();

  const showSurveyModal = UseShowSurveyModal();

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      setPageServiceUsage({
        tab: selectedNovaTab,
        serviceType: service[0].serviceType,
        isUsed: true
      })
    );
  }, []);

  const handleOpenSaveOverlay = async () => {
    overlay.open(({ isOpen, close }) => {
      return <VoiceSaveBottomSheet isOpened={isOpen} setIsOpened={close} />;
    });
  };

  const handleOpenPlaybackSpeed = async (
    handleChangeSpeedOtions: (nextSpeed: PlaybackSpeed) => void,
    currentSpeed: PlaybackSpeed
  ) => {
    const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
    if (isShowModal) return;

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

  const convertKoreanTimeToSeconds = (timeString: string): number => {
    // 정규식을 사용하여 분과 초 추출
    const minutesMatch = timeString.match(/(\d+)분/);
    const secondsMatch = timeString.match(/(\d+)초/);

    // 분과 초 값 추출 (없을 경우 0으로 설정)
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

    // 총 초 계산 및 반환
    return minutes * 60 + seconds;
  };

  const updateClientStatus = useCallback(() => {
    Bridge.callSyncBridgeApiWithCallback({
      api: 'getClientStatus',
      callback: async (status: ClientStatusType) => {
        setClientStatus(status);
      }
    });
  }, []);

  const ICON_BUTTON_LIST = [
    {
      name: t('Nova.Chat.InsertDoc.Title'),
      iconSrc: isLightMode ? insertDocIcon : insertDarkDocIcon,
      clickHandler: async () => {
        await insertDocsHandler();
      },
      isActive: clientStatus !== 'home'
    },
    {
      name: t('Nova.Chat.Copy'),
      iconSrc: isLightMode ? copyIcon : copyDarkIcon,
      clickHandler: async () => {
        const segments = voiceDictationResult!.data.segments;
        await copyText(parseJsonToText(segments));
      },
      isActive: true
    }
  ];

  useEffect(() => {
    updateClientStatus();
  }, [updateClientStatus]);

  return (
    <S.Wrapper>
      <S.Container>
        <S.ContentContainer>
          <S.Header>
            <S.Title lang={'ko'}>
              <img src={isLightMode ? CheckLightIcon : CheckDarkIcon} alt="check" />
              <span>{t('Nova.voiceDictation.Status.Completed')}</span>
            </S.Title>

            <S.Description>{t('Nova.voiceDictation.Status.ConversionSuccess')}</S.Description>
          </S.Header>

          <S.TranscriptContainer>
            <S.NewTranscript>
              <p>{t('Nova.voiceDictation.Button.NewDictation')}</p>
              <div>
                {ICON_BUTTON_LIST.filter((iconButton) => iconButton.isActive).map((iconButton) => (
                  <IconTextButton
                    key={iconButton.name}
                    onClick={iconButton.clickHandler}
                    tooltip={iconButton.name}
                    iconSrc={iconButton.iconSrc}
                    iconSize={24}
                    width={'fit'}
                  />
                ))}
              </div>
            </S.NewTranscript>
            <S.TimeWrapper>
              <span>
                {currentTime} · {audioDuration}
              </span>
            </S.TimeWrapper>

            <S.TranscriptScrollContainer>
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
            </S.TranscriptScrollContainer>
          </S.TranscriptContainer>
        </S.ContentContainer>

        <S.AudioPlayerContainer>
          <AudioPlayer
            audioSource={voiceDictationResult?.data.voiceUrl as string}
            endDuration={convertKoreanTimeToSeconds(audioDuration)}
            onPlay={async () => {
              const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
              if (isShowModal) return;
            }}
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
                onClick={async () => {
                  const isShowModal = await showSurveyModal(
                    selectedNovaTab,
                    service,
                    isCreditRecieved
                  );
                  if (isShowModal) return;

                  handleOpenSaveOverlay();
                }}>
                <img src={DownloadIcon} alt="download" />
                <span>{t(`Nova.Result.Save`)}</span>
              </Button>
            </S.ButtonWrapper>
          </AudioPlayer>
        </S.AudioPlayerContainer>
      </S.Container>
    </S.Wrapper>
  );
}
