import { useState } from 'react';
import * as React from 'react';
import { over } from 'lodash';
import { overlay } from 'overlay-kit';
import { css } from 'styled-components';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_CREDIT_OFFER } from '../../../../api/constant';
import CloseDarkIcon from '../../../../img/dark/ico_nova_close.svg';
import BadDisableDarkIcon from '../../../../img/dark/nova/survey/ico_bad_disable.svg';
import BadEnableDarkIcon from '../../../../img/dark/nova/survey/ico_bad_enable.svg';
import GoodDisableDarkIcon from '../../../../img/dark/nova/survey/ico_good_disable.svg';
import GoodEnableDarkIcon from '../../../../img/dark/nova/survey/ico_good_enable.svg';
import CloseLightIcon from '../../../../img/light/ico_nova_close.svg';
import BadDisableLightIcon from '../../../../img/light/nova/survey/ico_bad_disable.svg';
import BadEnableLightIcon from '../../../../img/light/nova/survey/ico_bad_enable.svg';
import GoodDisableLightIcon from '../../../../img/light/nova/survey/ico_good_disable.svg';
import GoodEnableLightIcon from '../../../../img/light/nova/survey/ico_good_enable.svg';
import { selectPageService } from '../../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../../store/slices/tabSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppSelector } from '../../../../store/store';
import { setCookie } from '../../../../util/common';
import Button from '../../../buttons/Button';
import CheckBox from '../../../checkbox';
import useErrorHandle from '../../../hooks/useErrorHandle';
import OverlayModal from '../../../overlay-modal';
import CreditOfferContent from '../ciredit-offer-modal-content';

import * as S from './style';

export default function SurveyModalContent() {
  const isLightMode = useAppSelector(themeInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const errHandle = useErrorHandle();
  const [result, setResult] = useState<'good' | 'bad' | null>(null);
  const [dontShowSurvey, setDontShowSurvey] = useState(false);

  const handleClose = () => {
    if (dontShowSurvey) {
      // 검증을 위해 7분으로 세팅
      const days = process.env.NODE_ENV == 'development' ? 0.00486 : 7;
      setCookie('dontShowSurvey', String(dontShowSurvey), days);
    }
    overlay.closeAll();
  };

  const handleSubmit = () => {
    handleOfferCredit().then(() => {
      showOfferCreditPopup();
    });
  };

  const handleOfferCredit = async () => {
    try {
      await apiWrapper().request(NOVA_CREDIT_OFFER, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creditType: 'AI_NOVA_FUNC_SATISFACTION_SURVEY',
          serviceType: service[0].serviceType
        }),
        method: 'POST'
      });
    } catch (error) {
      errHandle(error);
    }
  };

  const showOfferCreditPopup = () => {
    overlay.closeAll();

    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={close} padding={'24px'}>
          <CreditOfferContent />
        </OverlayModal>
      );
    });
  };

  return (
    <S.ModalContainer>
      <img
        src={isLightMode ? CloseLightIcon : CloseDarkIcon}
        alt="close"
        className="close"
        onClick={handleClose}
      />
      <S.TextWrap>
        <span className="title">{`NOVA의 결과가\n만족스러우셨나요?`}</span>
        <span className="desc">{`의견을 남겨주시면 50크레딧을 드려요!`}</span>
      </S.TextWrap>
      <S.ImageWrap>
        <img
          src={
            result === 'good'
              ? isLightMode
                ? GoodEnableLightIcon
                : GoodEnableDarkIcon
              : isLightMode
                ? GoodDisableLightIcon
                : GoodDisableDarkIcon
          }
          alt="good"
          onClick={() => setResult('good')}
        />
        <img
          src={
            result === 'bad'
              ? isLightMode
                ? BadEnableLightIcon
                : BadEnableDarkIcon
              : isLightMode
                ? BadDisableLightIcon
                : BadDisableDarkIcon
          }
          alt="bad"
          onClick={() => setResult('bad')}
        />
      </S.ImageWrap>
      <S.ButtonWrap>
        <Button
          variant="grayToPurple"
          width={'full'}
          height={48}
          selected={!!result}
          disable={!result}
          cssExt={css`
            display: flex;
            gap: 4px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            position: relative;
            opacity: 1;
          `}
          onClick={handleSubmit}>
          <span>{'의견 보내기'}</span>
        </Button>
        <S.CheckBoxWrap>
          <CheckBox
            isChecked={dontShowSurvey}
            onClick={() => setDontShowSurvey(!dontShowSurvey)}
            isCircleBox={false}
          />
          <span>일주일간 보지않기</span>
        </S.CheckBoxWrap>
      </S.ButtonWrap>
    </S.ModalContainer>
  );
}
