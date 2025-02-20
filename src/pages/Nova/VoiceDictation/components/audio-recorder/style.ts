import BlurDarkIcon from 'img/dark/nova/ico_bg_blur_loading.svg';
import BlurLightIcon from 'img/light/nova/ico_bg_blur_loading.png';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: ${({ theme }) =>
    `url(${theme.mode === 'light' ? BlurLightIcon : BlurDarkIcon})`};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const CanvasWrapper = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StatusText = styled.p<{ $isPaused: boolean }>`
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: -0.02em;
  text-align: center;
  color: ${(props) => (props.$isPaused ? '#9EA4AA' : '#6F3AD0')};
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 200px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: auto;
  height: 64px;
`;

const DurationText = styled.p`
  font-size: 28px;
  font-weight: 500;
  line-height: 42px;
  text-align: center;
`;

export { Background, ButtonGroup, Canvas, CanvasWrapper, Container, DurationText, StatusText };
