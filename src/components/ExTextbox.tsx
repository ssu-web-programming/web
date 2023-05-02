import styled, { css } from 'styled-components';
import SubTitle from './SubTitle';
import TextArea from './TextArea';
import { RowBox } from '../views/AIChatTab';
import { useState } from 'react';

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  border: solid 1px black;
  padding: 10px;
  box-sizing: border-box;
`;

export const TextButton = styled.div`
  display: flex;
  cursor: pointer;
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
          <TextButton
            onClick={() => {
              setValue(exampleList[Math.floor(Math.random() * exampleList.length)]);
            }}>
            예시 문구보기
          </TextButton>
        </RowBox>
      </InputArea>
    </>
  );
};

export default ExTextbox;
