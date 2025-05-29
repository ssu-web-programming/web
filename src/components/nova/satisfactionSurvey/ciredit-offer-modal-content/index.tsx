import * as React from 'react';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import GiftIcon from '../../../../img/common/ico_gift.svg';
import CreditMotionDark from '../../../../img/dark/nova/credit_motion.gif';
import { ReactComponent as ArrowDownIcon } from '../../../../img/light/ico_arrow_right.svg';
import CreditMotionLight from '../../../../img/light/nova/credit_motion.gif';
import { lang } from '../../../../locale';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppSelector } from '../../../../store/store';
import Bridge from '../../../../util/bridge';
import Button from '../../../buttons/Button';

import * as S from './style';

export default function CreditOfferContent() {
  const { t } = useTranslation();
  const isLightMode = useAppSelector(themeInfoSelector);

  const handleClose = () => {
    overlay.closeAll();
  };

  const handleBuyCredit = () => {
    Bridge.callBridgeApi('openWindow', `https://www.polarisoffice.com/${lang}/store`);
  };

  return (
    <S.ModalContainer>
      <S.ContentWrap>
        <S.TextWrap>
          <div className="title">
            <span>{t('Nova.Modal.Survey.Result.Gift')}</span>
            <img src={GiftIcon} alt="gift" />
          </div>
          <span className="desc">{t('Nova.Modal.Survey.Result.Greeting')}</span>
        </S.TextWrap>
        <S.ImageWrap>
          <img src={isLightMode ? CreditMotionLight : CreditMotionDark} alt="credit" />
        </S.ImageWrap>
      </S.ContentWrap>
      <S.ButtonWrap>
        <Button
          variant="purple"
          width={'full'}
          height={48}
          cssExt={css`
            display: flex;
            gap: 4px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            position: relative;
            opacity: 1;
          `}
          onClick={handleClose}>
          <span>{t('Nova.Modal.Survey.Result.Confirm')}</span>
        </Button>
        <S.BuyButton onClick={handleBuyCredit}>
          <span>{t('Nova.Modal.Survey.Result.BuyCredit')}</span>
          <ArrowDownIcon />
        </S.BuyButton>
      </S.ButtonWrap>
    </S.ModalContainer>
  );
}
