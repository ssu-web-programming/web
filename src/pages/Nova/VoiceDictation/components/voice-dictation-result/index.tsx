import Button from 'components/buttons/Button';
import CheckDarkIcon from 'img/dark/nova/check_purple.svg';
import DownloadIcon from 'img/light/ico_download_white.svg';
import CheckLightIcon from 'img/light/nova/check_purple.svg';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';
import { themeInfoSelector } from 'store/slices/theme';
import { useAppSelector } from 'store/store';
import { css } from 'styled-components';

import AudioPlayer from '../voice-audio-player';
import VoiceSaveBottomSheet from '../voice-save-bottom-sheet';

import * as S from './style';

export default function VoiceDictationResult() {
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { t } = useTranslation();

  const transcripts = [
    {
      id: 1,
      color: '#7c3aed',
      time: '00:01',
      text: '슈피리카 아니라 세소 피리라고 제발 좀 제수피'
    },
    {
      id: 2,
      color: '#10b981',
      time: '00:07',
      text: '죽느냐 사느냐 그것이 문제로다.'
    },
    {
      id: 3,
      color: '#ef4444',
      time: '00:07',
      text: 'The weather is so cold. Make sure to dress warmly to avoid catching a cold! What should you eat in cold weather?'
    },
    {
      id: 4,
      color: 'blue',
      time: '00:12',
      text: '가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는가나다라마바사가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는가나다라마바사가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는가나다라마바사 안녕하세요는 가나다라마바사 안녕하세요는'
    }
  ];

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
            <span>오늘 오후 10:57 · 1분 30초</span>
          </S.NewTranscript>

          {transcripts.map((transcript) => (
            <S.TranscriptItem key={transcript.id} color={transcript.color}>
              <S.TranscriptIcon color={transcript.color}>참{transcript.id}</S.TranscriptIcon>
              <S.TranscriptContent>
                <S.TranscriptInfo>
                  <S.TranscriptName>참석자{transcript.id}</S.TranscriptName>
                  <S.TranscriptTime>{transcript.time}</S.TranscriptTime>
                </S.TranscriptInfo>
                <S.TranscriptText>{transcript.text}</S.TranscriptText>
              </S.TranscriptContent>
            </S.TranscriptItem>
          ))}
        </S.TranscriptContainer>

        <AudioPlayer
          audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
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
