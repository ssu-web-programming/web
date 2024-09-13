import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import CreditButton from '../buttons/CreditButton';

const Header = styled.div``;

export default function TimeOut() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  return (
    <Header>
      time out<CreditButton>dd</CreditButton>
    </Header>
  );
}
