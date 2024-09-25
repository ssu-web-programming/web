import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { selectPageResult } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import { useChangeBackground } from '../hooks/nova/useChangeBackground';

import GoBackHeader from './GoBackHeader';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 16px;
  margin-top: 48px;
`;

const ImageBox = styled.div<{ isBordered: boolean }>`
  width: 240px;
  height: 240px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props) => (props.isBordered ? '1px solid #c9cdd2' : 'none')};
  border-radius: 8px;
  margin-top: 45px;

  div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }
`;

const TextWrap = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 138px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  gap: 10px;
  border: ${(props) => (props.isActive ? '1px solid #6f3ad0' : '1px solid #e8ebed')};
  border-radius: 8px;
  background: white;
`;

const TextArea = styled.textarea`
  width: 100%;
  flex: 1;
  padding: 0;
  outline: none;
  resize: none;
`;

const ButtonWrap = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  -webkit-tap-highlight-color: transparent;
`;

const ExamButton = styled.button`
  width: fit-content;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border-radius: 4px;
  background-color: #f2f4f6;
  cursor: pointer;

  span {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: #26282b;
  }
`;

const CreatingButton = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.isActive ? '#6f3ad0' : '#f7f8f9')};
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

export default function Prompt() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const result = useAppSelector(selectPageResult(selectedNovaTab));
  const { handleChangeBackground } = useChangeBackground();

  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [strings] = useState<string[]>([
    t(`Nova.Prompt.Exmaple1`),
    t(`Nova.Prompt.Exmaple2`),
    t(`Nova.Prompt.Exmaple3`),
    t(`Nova.Prompt.Exmaple4`),
    t(`Nova.Prompt.Exmaple5`),
    t(`Nova.Prompt.Exmaple6`)
  ]);
  const [index, setIndex] = useState<number>(0);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);
    setIsEnabled(newText.trim().length > 0);
  };

  const handleExamButtonClick = () => {
    const newIndex = (index + 1) % strings.length;
    setIndex(newIndex);
    setText(strings[newIndex]);
    setIsEnabled(strings[newIndex].trim().length > 0);
  };

  return (
    <Wrap>
      <GoBackHeader />
      <Body>
        <ImageBox isBordered={selectedNovaTab === NOVA_TAB_TYPE.removeBG}>
          <div>
            <img src={`data:${result?.contentType};base64,${result?.data}`} alt="result" />
          </div>
        </ImageBox>
        <TextWrap isActive={isEnabled}>
          <TextArea
            placeholder={t(`Nova.Prompt.Placeholder`) || ''}
            onChange={handleChange}
            value={text}
          />
          <ButtonWrap>
            <ExamButton onClick={handleExamButtonClick}>
              <span>{t(`Nova.Prompt.ExamButton`)}</span>
            </ExamButton>
          </ButtonWrap>
        </TextWrap>
        <CreatingButton
          isActive={isEnabled}
          onClick={isEnabled ? () => handleChangeBackground(text) : undefined}>
          <span>{t(`Nova.Prompt.CreatingButton`)}</span>
        </CreatingButton>
      </Body>
    </Wrap>
  );
}
