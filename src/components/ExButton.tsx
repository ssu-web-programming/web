import styled, { css } from 'styled-components';
import Icon from './Icon';
import icon_ai_change from '../img/ico_ai_change.svg';
import { alignItemCenter } from '../style/cssCommon';
import { useTranslation } from 'react-i18next';

const TextButton = styled.button<{ disabled: boolean }>`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  ${alignItemCenter}
  width: fit-content;
  height: fit-content;
  color: var(--gray-gray-80-02);

  ${({ disabled }: { disabled: boolean }) =>
    disabled &&
    css`
      color: var(--gray-gray-80-02);
      opacity: 0.3;
      pointer-events: none;
    `}
`;

interface ExButtonProps {
  exampleList: string[];
  setExam: Function;
  disable: boolean;
}

const ExButton = ({ exampleList, setExam, disable }: ExButtonProps) => {
  const { t } = useTranslation();

  return (
    <TextButton
      disabled={disable}
      onClick={() => {
        const text = exampleList[Math.floor(Math.random() * exampleList.length)];
        setExam(t(`ExampleList.${text}`));
      }}>
      <Icon
        iconSrc={icon_ai_change}
        cssExt={css`
          margin-right: 4px;
        `}
      />
      <div>{t(`ShowExam`)}</div>
    </TextButton>
  );
};

export default ExButton;
