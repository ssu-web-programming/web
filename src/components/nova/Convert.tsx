import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ReactComponent as Circular } from '../../img/nova/convert2DTo3D/circular.svg';
import CircularExam from '../../img/nova/convert2DTo3D/example/Circle.mp4';
import HorizontalExam from '../../img/nova/convert2DTo3D/example/Horizontal.mp4';
import PerspectiveExam from '../../img/nova/convert2DTo3D/example/Perspective.mp4';
import VerticalExam from '../../img/nova/convert2DTo3D/example/Vertical.mp4';
import ZoomExam from '../../img/nova/convert2DTo3D/example/Zoom.mp4';
import ZoomCenterExam from '../../img/nova/convert2DTo3D/example/ZoomCenter.mp4';
import ZoomLeftExam from '../../img/nova/convert2DTo3D/example/ZoomLeft.mp4';
import ZoomRightExam from '../../img/nova/convert2DTo3D/example/ZoomRight.mp4';
import { ReactComponent as Zoom } from '../../img/nova/convert2DTo3D/expand.svg';
import { ReactComponent as Horizontal } from '../../img/nova/convert2DTo3D/horizontal.svg';
import { ReactComponent as Perspective } from '../../img/nova/convert2DTo3D/perspective.svg';
import { ReactComponent as UpAndDown } from '../../img/nova/convert2DTo3D/updown.svg';
import { ReactComponent as Vertical } from '../../img/nova/convert2DTo3D/vertical.svg';
import { ReactComponent as ZoomLeft } from '../../img/nova/convert2DTo3D/zoomleft.svg';
import { ReactComponent as ZoomRight } from '../../img/nova/convert2DTo3D/zoomright.svg';
import { ClientType, getPlatform } from '../../util/bridge';
import { useConvert2DTo3D } from '../hooks/nova/useConvert2DTo3D';

import GoBackHeader from './GoBackHeader';

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
  background-color: #f4f6f8;
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
  color: #454c53;
`;

const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 1;
  max-width: 480px;
  max-height: 480px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px auto 16px;
  border: 1px solid #c9cdd2;
  border-radius: 8px;
  background: #e8ebed;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    max-width: 480px;
    max-height: 480px;
    object-fit: contain;
    border-radius: 8px;
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
    color: #454c53;
  }
`;

const GridBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 76px);
  grid-template-rows: repeat(2, 73px);
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const GridItem = styled.div<{ isSelected: boolean }>`
  width: 76px;
  height: 73px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.isSelected ? '#ede5fe' : 'white')};
  border: ${(props) => (props.isSelected ? '1px solid #c6a9ff' : 'none')};
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;

  svg {
    path {
      fill: ${(props) => (props.isSelected ? '#6f3ad0' : '#72787f')};
    }

    circle {
      stroke: ${(props) => (props.isSelected ? '#6f3ad0' : '#72787f')};
    }
  }

  p {
    margin-top: 4px;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: ${(props) => (props.isSelected ? '#6f3ad0' : '#72787f')};
  }
`;

const FileFormatGuideText = styled.p`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  color: #454c53;
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
  border: ${(props) => (props.isSelected ? '1px solid #c6a9ff' : 'none')};
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  text-align: center;
  white-space: break-spaces;
  background: ${(props) => (props.isSelected ? '#ede5fe' : 'white')};
  color: ${(props) => (props.isSelected ? '#6f3ad0' : '#72787f')};

  .title {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
  }
`;

const ConvertButton = styled.div<{ isActive: boolean }>`
  width: 100%;
  max-width: 480px;
  height: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0 auto;
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
  color: #9ea4aa;
  margin-top: 8px;

  .highlight {
    color: #454c53;
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

  const text = t('Nova.Convert.MobileGuide');

  const handleOptionClick = (option: ConvertOption) => {
    setSelectedOption(option);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current && selectedOption) {
      videoRef.current.pause();
      videoRef.current.load();

      videoRef.current.onloadeddata = () => {
        videoRef.current?.play();
      };
    }
  }, [selectedOption]);

  return (
    <Wrap>
      <GoBackHeader />
      <Container>
        <Body>
          <ExampleText>{t(`Nova.Convert.Example`)}</ExampleText>
          <ImageBox>
            {selectedOption && (
              <video ref={videoRef} loop>
                <source src={selectedOption.example} type="video/mp4" />
              </video>
            )}
          </ImageBox>
          <SelectionBox>
            <p>{t(`Nova.Convert.SelectExampleText`)}</p>
            <GridBox>
              {options.map((option) => (
                <GridItem
                  key={option.option}
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
