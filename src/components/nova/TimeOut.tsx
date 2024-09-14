import React from 'react';
import CreditColorIcon from 'img/ico_credit_color_outline.svg';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 0 16px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  white-space: break-spaces;
  color: #454c53;
`;

const ButtonWrap = styled.div`
  width: 100%;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6f3ad0;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: white;
  }

  img {
    position: absolute;
    right: 12px;
  }
`;

export default function TimeOut() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Title>{t(`Nova.TimeOut.Title`)}</Title>
      <ButtonWrap>
        <span>{t(`Nova.TimeOut.Retry`)}</span>
        <img src={CreditColorIcon} alt="credit" />
      </ButtonWrap>
    </Wrap>
  );
}
