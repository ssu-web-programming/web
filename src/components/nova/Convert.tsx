import { useState } from 'react';
import { lang } from 'locale';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

import { ReactComponent as Circular } from '../../img/light/nova/convert2DTo3D/circular.svg';
import CircularExam from '../../img/light/nova/convert2DTo3D/example/Circle.mp4';
import HorizontalExam from '../../img/light/nova/convert2DTo3D/example/Horizontal.mp4';
import PerspectiveExam from '../../img/light/nova/convert2DTo3D/example/Perspective.mp4';
import VerticalExam from '../../img/light/nova/convert2DTo3D/example/Vertical.mp4';
import ZoomExam from '../../img/light/nova/convert2DTo3D/example/Zoom.mp4';
import ZoomCenterExam from '../../img/light/nova/convert2DTo3D/example/ZoomCenter.mp4';
import ZoomLeftExam from '../../img/light/nova/convert2DTo3D/example/ZoomLeft.mp4';
import ZoomRightExam from '../../img/light/nova/convert2DTo3D/example/ZoomRight.mp4';
import { ReactComponent as Zoom } from '../../img/light/nova/convert2DTo3D/expand.svg';
import { ReactComponent as Horizontal } from '../../img/light/nova/convert2DTo3D/horizontal.svg';
import { ReactComponent as Perspective } from '../../img/light/nova/convert2DTo3D/perspective.svg';
import { ReactComponent as UpAndDown } from '../../img/light/nova/convert2DTo3D/updown.svg';
import { ReactComponent as Vertical } from '../../img/light/nova/convert2DTo3D/vertical.svg';
import { ReactComponent as ZoomLeft } from '../../img/light/nova/convert2DTo3D/zoomleft.svg';
import { ReactComponent as ZoomRight } from '../../img/light/nova/convert2DTo3D/zoomright.svg';
import { ClientType, getPlatform } from '../../util/bridge';
import { useConvert2DTo3D } from '../hooks/nova/useConvert2DTo3D';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  flex: 1 1 0;
  overflow-y: auto;
  background: ${({ theme }) => theme.color.bg};
  color: ${({ theme }) => theme.color.text.gray05};
`;

const Body = styled.div`
  width: 100%;
  margin: auto;
`;

const ExampleText = styled.p`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
`;

const ImageBox = styled.div`
  width: 100%;
  max-width: 480px;
  aspect-ratio: 16 / 9;
  position: relative;
  margin: 8px auto 16px;
  border-radius: 8px;
  overflow: hidden;

  .react-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
  }

  div {
    border-radius: 8px;
  }

  video {
    border: 1px solid #c9cdd2;
    border-radius: 8px;
    width: 100% !important;
    height: 100% !important;
    object-fit: fill;
  }
`;

const SelectionBox = styled.div`
  width: 100%;
  margin-top: 16px;

  p {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
  }
`;

const GridBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 76px);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const GridItem = styled.div<{ lang: string; isSelected: boolean }>`
  width: 78px;
  height: ${(props) => (props.lang != 'en' ? '73px' : '94px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme, isSelected }) =>
    isSelected ? theme.color.tab.highlightBg : theme.color.background.gray05};
  border: ${({ theme, isSelected }) =>
    isSelected ? `1px solid ${theme.color.border.purple01}` : 'none'};
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  white-space: pre-wrap;

  svg {
    path {
      fill: ${({ theme, isSelected }) =>
        isSelected
          ? theme.mode === 'light'
            ? 'var(--ai-purple-50-main)'
            : 'var(--ai-purple-90)'
          : theme.mode === 'light'
            ? 'var(--gray-gray-70)'
            : 'var(--gray-gray-25)'};
    }

    circle {
      stroke: ${({ theme, isSelected }) =>
        isSelected
          ? theme.mode === 'light'
            ? 'var(--ai-purple-50-main)'
            : 'var(--ai-purple-90)'
          : theme.mode === 'light'
            ? 'var(--gray-gray-70)'
            : 'var(--gray-gray-25)'};
    }
  }

  p {
    width: 100%;
    margin-top: 4px;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;

    color: ${({ theme, isSelected }) =>
      isSelected ? theme.color.text.main : theme.color.text.gray06};
  }
`;

const FileFormatGuideText = styled.p`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  color: ${({ theme }) => theme.color.text.gray03};
`;

const SelectFileFormatBox = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  gap: 8px;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 8px;
`;

const FileFormatBox = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  box-sizing: border-box;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  text-align: center;
  white-space: break-spaces;
  background: ${({ theme, isSelected }) =>
    isSelected ? theme.color.tab.highlightBg : theme.color.background.gray05};
  border: ${({ theme, isSelected }) =>
    isSelected ? `1px solid ${theme.color.border.purple01}` : 'none'};
  border-radius: 8px;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.color.text.main : theme.color.text.gray06};

  .title {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: ${({ theme, isSelected }) =>
      isSelected ? theme.color.text.main : theme.color.text.gray03};
  }
`;

const ConvertButton = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px auto;
  background: ${(props) => (props.isActive ? '#6f3ad0' : '#f2f4f6')};
  border-radius: 8px;
  cursor: ${(props) => (props.isActive ? 'pointer' : 'default')};
  -webkit-tap-highlight-color: transparent;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${(props) => (props.isActive ? '#ffffff' : '#c9cdd2')};
  }
`;

const MobileGuideText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
  color: ${({ theme }) => theme.color.text.gray07};
  margin-top: 8px;

  .highlight {
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

interface ConvertOption {
  src: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  option: string;
  example: string;
}

const options: ConvertOption[] = [
  { src: Vertical, option: 'Vertical', example: VerticalExam },
  { src: Horizontal, option: 'Horizontal', example: HorizontalExam },
  { src: Circular, option: 'Circle', example: CircularExam },
  { src: Perspective, option: 'Perspective', example: PerspectiveExam },
  { src: Zoom, option: 'Zoom', example: ZoomExam },
  { src: ZoomLeft, option: 'ZoomLeft', example: ZoomLeftExam },
  { src: UpAndDown, option: 'ZoomCenter', example: ZoomCenterExam },
  { src: ZoomRight, option: 'ZoomRight', example: ZoomRightExam }
];

type FileFormat = 'mp4' | 'gif';

export default function Convert() {
  const { t } = useTranslation();
  const { handleConver2DTo3D } = useConvert2DTo3D();
  const platform = getPlatform();
  const isMobile = platform === ClientType.ios || platform === ClientType.android;

  const verticalOption = options.find((option) => option.option === 'Vertical') || null;
  const [selectedOption, setSelectedOption] = useState<ConvertOption | null>(verticalOption);
  const [fileFormat, setFileFormat] = useState<FileFormat>('mp4');

  const text = t('Index.Convert.MobileGuide');

  const handleOptionClick = (option: ConvertOption) => {
    setSelectedOption(option);
  };

  return (
    <Wrap>
      <Container>
        <Body>
          <ExampleText>{t(`Nova.Convert.Example`)}</ExampleText>
          <ImageBox>
            {selectedOption && (
              <ReactPlayer
                key={selectedOption.example}
                url={selectedOption.example}
                loop
                playing
                playsinline
                muted
                width="100%"
                height="100%"
                config={{
                  file: {
                    attributes: {
                      preload: 'auto' // 비디오 미리 로딩
                    }
                  }
                }}
              />
            )}
          </ImageBox>
          <SelectionBox>
            <p>{t(`Nova.Convert.SelectExampleText`)}</p>
            <GridBox>
              {options.map((option) => (
                <GridItem
                  key={option.option}
                  lang={lang}
                  isSelected={selectedOption?.option === option.option}
                  onClick={() => handleOptionClick(option)}>
                  <option.src />
                  <p>{t(`Nova.Convert.${option.option}`)}</p>
                </GridItem>
              ))}
            </GridBox>
          </SelectionBox>
          {!isMobile && (
            <>
              <FileFormatGuideText>{t(`Nova.Convert.SelectFileFormat`)}</FileFormatGuideText>
              <SelectFileFormatBox>
                <FileFormatBox
                  isSelected={fileFormat === 'mp4'}
                  onClick={() => setFileFormat('mp4')}>
                  <p className="title">{t(`Nova.Convert.MP4`)}</p>
                  <p>{t(`Nova.Convert.MP4Guide`)}</p>
                </FileFormatBox>
                <FileFormatBox
                  isSelected={fileFormat === 'gif'}
                  onClick={() => setFileFormat('gif')}>
                  <p className="title">{t(`Nova.Convert.GIF`)}</p>
                  <p>{t(`Nova.Convert.GIFGuide`)}</p>
                </FileFormatBox>
              </SelectFileFormatBox>
            </>
          )}
          <ConvertButton
            isActive={!!selectedOption}
            onClick={
              selectedOption
                ? () => handleConver2DTo3D(selectedOption?.option, fileFormat)
                : undefined
            }>
            <span>{t(`Nova.Convert.Button`)}</span>
          </ConvertButton>
          {isMobile && <MobileGuideText dangerouslySetInnerHTML={{ __html: text }} />}
        </Body>
      </Container>
    </Wrap>
  );
}
