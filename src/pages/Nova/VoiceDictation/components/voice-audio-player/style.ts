import { ReactComponent as Pause } from 'img/light/nova/voiceDictation/player_pause.svg';
import { ReactComponent as Play } from 'img/light/nova/voiceDictation/player_play.svg';
import styled from 'styled-components';

interface ProgressBarProps {
  progress: string;
}

// 스타일드 컴포넌트 정의
const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.background.gray01};
  margin-top: 12px;
`;

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.color.background.gray02};
  border-radius: 9999px;
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    height: 5px;
  }
`;

const ProgressBar = styled.div<ProgressBarProps>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${(props) => props.progress};
  background-color: #6f3ad0;
  border-radius: 9999px;
  transition: width 0.1s linear;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.gray01};
  margin: 0px 16px;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    color: #1f2937;
  }
`;

const PlaybackSpeedButton = styled(Button)`
  display: flex;
  font-size: 14px;
  font-weight: 700;
  flex-direction: row;
  gap: 3px;
  color: ${({ theme }) => theme.color.text.gray03};
`;

const SkipButton = styled(Button)`
  span {
    font-size: 12px;
  }
`;

const PlayButton = styled(Button)`
  color: #1f2937;

  &:hover {
    color: #111827;
  }
`;

const StyledPause = styled(Pause)`
  & path {
    fill: ${({ theme }) => theme.color.text.gray03};
  }
`;

const StyledPlay = styled(Play)`
  & path {
    fill: ${({ theme }) => theme.color.text.gray03};
  }
`;

export {
  Container,
  ControlsContainer,
  PlaybackSpeedButton,
  PlayButton,
  ProgressBar,
  ProgressBarContainer,
  SkipButton,
  StyledPause,
  StyledPlay,
  TimeDisplay
};
