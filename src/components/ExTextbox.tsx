import styled, { css } from 'styled-components';
import SubTitle from './SubTitle';
import TextArea from './TextArea';
import { LengthWrapper, RowBox } from '../views/AIChatTab';
import ExButton from './ExButton';

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex-direction: column;
  margin: 10px 0px 10px;
  border-radius: 4px;
  border: solid 1px var(--gray-gray-50);
  width: 100%;
`;

const TopBorer = styled(RowBox)`
  border-top: 1px solid #e8ebed;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 3px 8px 11px;
`;

interface ExTextboxProps {
  subTitle?: string;
  value: string;
  maxtTextLen: number;
  setValue: Function;
  exampleList: string[];
  placeholder?: string;
}

const ExTextbox = ({
  subTitle,
  value,
  setValue,
  exampleList,
  maxtTextLen,
  placeholder
}: ExTextboxProps) => {
  return (
    <>
      {subTitle && <SubTitle subTitle={subTitle} />}
      <InputArea>
        <TextArea
          placeholder={placeholder}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue && e?.target?.value.length <= maxtTextLen && setValue(e.currentTarget.value);
          }}
          cssExt={css`
            box-sizing: border-box;
            border: none;
            margin: 8px 12px 8px 12px;
          `}
        />
        <TopBorer>
          <LengthWrapper>
            {value.length}/{maxtTextLen}
          </LengthWrapper>
          <ExButton exampleList={exampleList} setExam={setValue} />
        </TopBorer>
      </InputArea>
    </>
  );
};

export default ExTextbox;
