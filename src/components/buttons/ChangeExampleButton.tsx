import { ButtonHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledButton = styled.button<{ disabled?: boolean }>`
  padding: 7px 12px;
  border-radius: 6px;
  color: ${({ disabled }) => (disabled ? '#9EA4AA' : '#26282b')};
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  background-color: #f2f4f6;
`;

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function ChangeExampleButton({ onClick, disabled }: Props) {
  const { t } = useTranslation();

  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {t(`ShowExam`)}
    </StyledButton>
  );
}
