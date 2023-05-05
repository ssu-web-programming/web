import styled, { css } from 'styled-components';
import Icon from './Icon';
import icon_ai_change from '../img/ico_ai_change.svg';

export const TextButton = styled.div`
  display: flex;
  cursor: pointer;
  font-family: NotoSansCJKKR;
  font-size: 12px;
  color: var(--gray-gray-70);
`;

interface ExButtonProps {
  exampleList: string[];
  setExam: Function;
}

const ExButton = ({ exampleList, setExam }: ExButtonProps) => {
  return (
    <TextButton
      onClick={() => {
        setExam(exampleList[Math.floor(Math.random() * exampleList.length)]);
      }}>
      <Icon
        iconSrc={icon_ai_change}
        cssExt={css`
          margin-right: 4px;
        `}
      />
      예시 문구보기
    </TextButton>
  );
};

export default ExButton;
