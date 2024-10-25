import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ReactComponent as Circular } from '../../img/nova/convert2DTo3D/circular.svg';
import { ReactComponent as ZoomInOut } from '../../img/nova/convert2DTo3D/expand.svg';
import { ReactComponent as Horizontal } from '../../img/nova/convert2DTo3D/horizontal.svg';
import { ReactComponent as Perspective } from '../../img/nova/convert2DTo3D/perspective.svg';
import { ReactComponent as UpAndDown } from '../../img/nova/convert2DTo3D/updown.svg';
import { ReactComponent as Vertical } from '../../img/nova/convert2DTo3D/vertical.svg';
import { ReactComponent as ZoomLeft } from '../../img/nova/convert2DTo3D/zoomleft.svg';
import { ReactComponent as ZoomRight } from '../../img/nova/convert2DTo3D/zoomright.svg';
import { selectPageResult } from '../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
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
  padding: 0 16px;
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
  aspect-ratio: 1 / 1;
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

  img {
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

const ConvertButton = styled.div<{ isActive: boolean }>`
  width: 100%;
  max-width: 480px;
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

const options = [
  { src: Vertical, option: 'Vertical' },
  { src: Horizontal, option: 'Horizontal' },
  { src: Circular, option: 'Circle' },
  { src: Perspective, option: 'Perspective' },
  { src: ZoomInOut, option: 'Zoom' },
  { src: ZoomLeft, option: 'ZoomLeft' },
  { src: UpAndDown, option: 'ZoomCenter' },
  { src: ZoomRight, option: 'ZoomRight' }
];

export default function Convert() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const result = useAppSelector(selectPageResult(selectedNovaTab));
  const { handleConver2DTo3D } = useConvert2DTo3D();

  const [selectedOption, setSelectedOption] = useState<{ option: string } | null>(null);
  const handleOptionClick = (option: string) => {
    setSelectedOption({ option });
  };

  return (
    <Wrap>
      <GoBackHeader />
      <Container>
        <Body>
          <ExampleText>{t(`Nova.Convert.Example`)}</ExampleText>
          <ImageBox>
            <img src={`data:${result?.contentType};base64,${result?.data}`} alt="result" />
          </ImageBox>
          <SelectionBox>
            <p>{t(`Nova.Convert.SelectExampleText`)}</p>
            <GridBox>
              {options.map((option) => (
                <GridItem
                  key={option.option}
                  isSelected={selectedOption?.option === option.option}
                  onClick={() => handleOptionClick(option.option)}>
                  <option.src />
                  <p>{t(`Nova.Convert.${option.option}`)}</p>
                </GridItem>
              ))}
            </GridBox>
          </SelectionBox>
          <ConvertButton
            isActive={!!selectedOption}
            onClick={selectedOption ? () => handleConver2DTo3D(selectedOption?.option) : undefined}>
            <span>{t(`Nova.Convert.Button`)}</span>
          </ConvertButton>
        </Body>
      </Container>
    </Wrap>
  );
}
