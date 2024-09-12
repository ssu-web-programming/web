import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import BlurIcon from '../../img/nova/bg_blur_loading.png';
import Spinner from '../../img/nova/nova_spinner_2x.webp';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${BlurIcon});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  img {
    transform: scale(0.5);
  }

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #6f3ad0;
  }
`;

export default function Loading() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  return (
    <Background>
      <img src={Spinner} alt="spinner" />
      <span>{t(`Nova.${selectedNovaTab}.Loading`)}</span>
    </Background>
  );
}
