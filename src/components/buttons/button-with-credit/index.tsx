import { ButtonHTMLAttributes } from 'react';
import CreditColorDisabledIcon from 'img/light/credit_color_outline.svg';
import CreditColorIcon from 'img/light/ico_credit_color_outline.svg';
import styled from 'styled-components';

interface ButtonWithCreditProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isActive: boolean;
  creditAmount?: number;
  activeCreditIcon?: string;
  inactiveCreditIcon?: string;
  className?: string;
}

export default function ButtonWithCredit({
  text,
  isActive,
  creditAmount = 20,
  activeCreditIcon = CreditColorIcon,
  inactiveCreditIcon = CreditColorDisabledIcon,
  className,
  ...otherProps
}: ButtonWithCreditProps) {
  return (
    <S.ButtonWrap {...otherProps} $isActive={isActive} disabled={!isActive} className={className}>
      <span>{text}</span>
      <div>
        <img
          src={isActive ? activeCreditIcon : inactiveCreditIcon}
          alt="credit"
          width={20}
          height={20}
        />
        <span>{creditAmount}</span>
      </div>
    </S.ButtonWrap>
  );
}

const S = {
  ButtonWrap: styled.button<{ $isActive: boolean }>`
    width: 100%;
    height: 48px;
    min-height: 48px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px 0;
    background: ${({ $isActive, theme }) =>
      $isActive ? 'var(--ai-purple-50-main)' : theme.color.background.gray02};
    border: none;
    cursor: ${(props) => (props.$isActive ? 'pointer' : 'default')};
    border-radius: 8px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &:disabled {
      pointer-events: none;
      opacity: 0.7;
    }

    & > span {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: ${({ $isActive }) => ($isActive ? '#fff' : '#9ea4aa')};
    }

    div {
      display: flex;
      position: absolute;
      right: 12px;
      align-items: center;
      gap: 2px;

      & > span {
        font-size: 14px;
        color: ${({ $isActive }) => ($isActive ? '#fff' : '#9ea4aa')};
      }
    }
  `
};
