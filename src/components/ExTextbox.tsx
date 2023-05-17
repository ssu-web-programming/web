import styled, { css } from 'styled-components';
import SubTitle from './SubTitle';
import TextArea from './TextArea';
import { LengthWrapper, RowBox } from '../views/AIChatTab';
import ExButton from './ExButton';
import { useState } from 'react';

const InputArea = styled.div<{ activeBorder: boolean }>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex-direction: column;
  margin: 10px 0px 10px;
  border-radius: 4px;
  border: ${({ activeBorder }: { activeBorder: boolean }) =>
    activeBorder ? 'solid 1px var(--ai-purple-50-main)' : 'solid 1px var(--gray-gray-50)'};
  width: 100%;
`;

const TopBorer = styled(RowBox)`
  border-top: 1px solid #e8ebed;
  width: 100%;
  box-sizing: border-box;
  padding: 0px 6px 0px 11px;
  height: 34px;
`;

interface ExTextboxProps {
  subTitle?: string;
  value: string;
  maxtTextLen: number;
  setValue: Function;
  exampleList: string[];
  placeholder?: string;
  rows?: number;
}

const ExTextbox = ({
  subTitle,
  value,
  setValue,
  exampleList,
  maxtTextLen,
  placeholder,
  rows
}: ExTextboxProps) => {
  const [activeTextbox, setActiveTextbox] = useState<boolean>(false);

  return (
    <>
      {subTitle && <SubTitle subTitle={subTitle} />}
      <InputArea activeBorder={activeTextbox}>
        <TextArea
          onClick={() => {
            setActiveTextbox(true);
          }}
          onBlur={() => {
            setActiveTextbox(false);
          }}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue && setValue(e.currentTarget.value.slice(0, maxtTextLen));
          }}
          cssExt={css`
            box-sizing: border-box;
            border: none;
            margin: 8px 12px 8px 12px;
          `}
        />
        <TopBorer>
          <LengthWrapper isError={value.length >= maxtTextLen}>
            {value.length}/{maxtTextLen}
          </LengthWrapper>
          <ExButton disable={value.length > 0} exampleList={exampleList} setExam={setValue} />
        </TopBorer>
      </InputArea>
    </>
  );
};

export default ExTextbox;
