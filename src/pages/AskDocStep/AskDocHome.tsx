import { Outlet } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useTranslation } from 'react-i18next';
import { WrapperPage, Body } from '../../style/askDoc';
import Modals, { Overlay } from '../../components/askDoc/modals/Modals';
import { Suspense, useEffect } from 'react';
import useGtmPageChange from '../../components/hooks/useGtmPageChange';
import { useConfirm } from 'components/Confirm';
import Bridge from 'util/bridge';

export const AskDocHome = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  useGtmPageChange();

  useEffect(() => {
    confirm({
      title: t('EOS.ASKDocEOSTitle2')!,
      msg: t('EOS.ASKDocEOSDesc2')!,
      onOk: {
        text: t('Confirm'),
        callback: () => Bridge.callBridgeApi('closePanel', '')
      }
    });
  }, []);

  return (
    <WrapperPage>
      <Header title={t('AITools')} subTitle={'ASK Doc'}></Header>
      <Body>{/* <Outlet /> */}</Body>
      <Suspense fallback={<Overlay />}>
        <Modals />
      </Suspense>
    </WrapperPage>
  );
};

export default AskDocHome;
