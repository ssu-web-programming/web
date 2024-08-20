import { Outlet } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useTranslation } from 'react-i18next';
import { WrapperPage, Body } from '../../style/askDoc';
import Modals, { Overlay } from '../../components/askDoc/modals/Modals';
import { Suspense, useEffect } from 'react';
import useGtmPageChange from '../../components/hooks/useGtmPageChange';
import { useConfirm } from 'components/Confirm';
import Bridge from 'util/bridge';
import useLangParameterNavigate from 'components/hooks/useLangParameterNavigate';

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
