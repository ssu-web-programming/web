import styled from 'styled-components';
import SubTitle from './SubTitle';
import TextArea from './TextArea';
import { LengthWrapper } from '../views/AIChatTab';
import ChangeExampleButton from './buttons/ChangeExampleButton';
import { useState } from 'react';
import { alignItemCenter, flex, flexColumn, justiSpaceBetween } from '../style/cssCommon';
import { useTranslation } from 'react-i18next';

const InputArea = styled.div<{ activeBorder: boolean }>`
  ${flex}
  ${flexColumn}

  box-sizing: border-box;
  /* margin: 10px 0px 10px; */
  border-radius: 4px;
  height: 153px;
  box-sizing: border-box;
  border: ${({ activeBorder }: { activeBorder: boolean }) =>
    activeBorder ? 'solid 1px var(--ai-purple-50-main)' : 'solid 1px var(--gray-gray-50)'};
  width: 100%;

  textarea {
    box-sizing: border-box;
    border: none;
    margin: 8px 12px 8px 12px;
  }
`;

const TopBorer = styled.div`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  width: 100%;

  border-top: 1px solid #e8ebed;
  width: 100%;
  box-sizing: border-box;
  padding: 0px 6px 0px 11px;
  height: 34px;
`;

interface ExTextboxProps {
  subTitle?: string;
  value: string;
  maxTextLen: number;
  setValue: (val: string) => void;
  exampleList: string[];
  placeholder?: string;
  rows?: number;
}

const ExTextbox = ({
  subTitle,
  value,
  setValue,
  exampleList,
  maxTextLen,
  placeholder,
  rows
}: ExTextboxProps) => {
  const { t } = useTranslation();
  const [activeTextbox, setActiveTextbox] = useState<boolean>(false);

  const refreshExampleText = () => {
    const text = exampleList[Math.floor(Math.random() * exampleList.length)];
    setValue(t(`ExampleList.${text}`) || '');
  };

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
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setValue(e.currentTarget.value.slice(0, maxTextLen));
          }}
        />
        <TopBorer>
          <LengthWrapper isError={value.length >= maxTextLen}>
            {value.length}/{maxTextLen}
          </LengthWrapper>
          <ChangeExampleButton disable={value.length > 0} onClick={refreshExampleText} />
        </TopBorer>
      </InputArea>
    </>
  );
};

export default ExTextbox;
