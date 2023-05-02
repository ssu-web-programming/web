import styled, { css } from 'styled-components';
import SubTitle from './SubTitle';
import TextArea from './TextArea';
import { RowBox } from '../views/AIChatTab';
import { useState } from 'react';
import ExButton from './ExButton';

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  border: solid 1px black;
  padding: 10px;
  box-sizing: border-box;
`;

export const LengthWrapper = styled.div`
  display: flex;
  color: lightgray;
`;

interface ExTextboxProps {
  subTitle: string;
  value: string;
  maxtTextLen: number;
  setValue: Function;
  exampleList: string[];
}

const ExTextbox = ({ subTitle, value, setValue, exampleList, maxtTextLen }: ExTextboxProps) => {
  return (
    <>
      <SubTitle subTitle={subTitle} />
      <InputArea>
        <TextArea
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.currentTarget.value.length <= maxtTextLen && setValue(e.currentTarget.value);
          }}
          cssExt={css`
            box-sizing: border-box;
          `}
        />
        <RowBox>
          <LengthWrapper>
            {value.length}/{maxtTextLen}
          </LengthWrapper>
          <ExButton exampleList={exampleList} setExam={setValue} />
        </RowBox>
      </InputArea>
    </>
  );
};

export default ExTextbox;
