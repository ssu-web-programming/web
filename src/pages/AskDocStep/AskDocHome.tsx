import { Suspense, useEffect } from 'react';
import { useConfirm } from 'components/Confirm';
import useLangParameterNavigate from 'components/hooks/useLangParameterNavigate';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import Bridge from 'util/bridge';

import Modals, { Overlay } from '../../components/askDoc/modals/Modals';
import useGtmPageChange from '../../components/hooks/useGtmPageChange';
import Header from '../../components/layout/Header';
import { Body, WrapperPage } from '../../style/askDoc';

export const AskDocHome = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const param = useLangParameterNavigate();
  useGtmPageChange();

  useEffect(() => {
    if (!param.isTesla && !param.isObigo) {
      confirm({
        title: t('EOS.ASKDocEOSTitle2')!,
        msg: t('EOS.ASKDocEOSDesc2')!,
        onOk: {
          text: t('Confirm'),
          callback: () => Bridge.callBridgeApi('closePanel', 'shutDown')
        }
      });
    }
  });

  return (
    <WrapperPage>
      <Header title={t('AITools')} subTitle={'ASK Doc'}></Header>
      <Body>{(param.isTesla || param.isObigo) && <Outlet />}</Body>
      <Suspense fallback={<Overlay />}>
        <Modals />
      </Suspense>
    </WrapperPage>
  );
};

export default AskDocHome;
