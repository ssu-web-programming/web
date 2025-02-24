import * as React from 'react';
import { overlay } from 'overlay-kit';
import { css } from 'styled-components';

import GiftIcon from '../../../../img/common/ico_gift.svg';
import CreditMotionDark from '../../../../img/dark/nova/credit_motion.gif';
import { ReactComponent as ArrowDownIcon } from '../../../../img/light/ico_arrow_right.svg';
import CreditMotionLight from '../../../../img/light/nova/credit_motion.gif';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppSelector } from '../../../../store/store';
import Bridge from '../../../../util/bridge';
import Button from '../../../buttons/Button';

import * as S from './style';

export default function CreditOfferContent() {
  const isLightMode = useAppSelector(themeInfoSelector);

  const handleClose = () => {
    overlay.closeAll();
  };

  const handleBuyCredit = () => {
    Bridge.callBridgeApi('openWindow', 'https://www.polarisoffice.com/ko/store');
  };

  return (
    <S.ModalContainer>
      <S.ContentWrap>
        <S.TextWrap>
          <div className="title">
            <span>{`50크레딧을 선물로 드릴게요!`}</span>
            <img src={GiftIcon} alt="gift" />
          </div>
          <span className="desc">{`소중한 의견 감사해요!\n더 좋은 기능으로 보답할게요.`}</span>
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
          <span>{'확인'}</span>
        </Button>
        <S.BuyButton onClick={handleBuyCredit}>
          <span>단품 크레딧 구매하기</span>
          <ArrowDownIcon />
        </S.BuyButton>
      </S.ButtonWrap>
    </S.ModalContainer>
  );
}
