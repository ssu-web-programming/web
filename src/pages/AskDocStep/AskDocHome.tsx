import { Outlet } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useTranslation } from 'react-i18next';
import { WrapperPage, Body } from '../../style/askDoc';
import Modals, { Overlay } from '../../components/askDoc/modals/Modals';
import { Suspense } from 'react';
import useGtmPageChange from '../../components/hooks/useGtmPageChange';

export const AskDocHome = () => {
  const { t } = useTranslation();
  useGtmPageChange();
  return (
    <WrapperPage>
      <Header title={t('AITools')} subTitle={'ASK Doc'}></Header>
      <Body>
        <Outlet />
      </Body>
      <Suspense fallback={<Overlay />}>
        <Modals />
      </Suspense>
    </WrapperPage>
  );
};

export default AskDocHome;
