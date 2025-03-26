import { useState } from 'react';
import { overlay } from 'overlay-kit';
import { css } from 'styled-components';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_CREDIT_OFFER } from '../../../../api/constant';
import { getServiceLoggingInfo, SERVICE_TYPE } from '../../../../constants/serviceType';
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
import {
  selectPageService,
  setPageCreditReceivedByServiceType
} from '../../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../../store/slices/tabSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { setCookie } from '../../../../util/common';
import Button from '../../../buttons/Button';
import CheckBox from '../../../checkbox';
import useErrorHandle from '../../../hooks/useErrorHandle';
import OverlayModal from '../../../overlay-modal';
import CreditOfferContent from '../ciredit-offer-modal-content';

import * as S from './style';

export default function SurveyModalContent() {
  const dispatch = useAppDispatch();
  const isLightMode = useAppSelector(themeInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const errHandle = useErrorHandle();
  const [result, setResult] = useState<'great' | 'sorry' | null>(null);
  const [dontShowSurvey, setDontShowSurvey] = useState(false);

  const handleClose = () => {
    // 검증을 위해 1분으로 세팅 / 상용은 1시간
    const minute = process.env.NODE_ENV == 'production' ? 60 : 1;
    setCookie(`closeSurvey${selectedNovaTab}`, String('closeSurvey'), minute);

    overlay.closeAll();
  };

  const handleSubmit = () => {
    if (dontShowSurvey) {
      // 검증을 위해 7분으로 세팅
      const minute = process.env.NODE_ENV == 'production' ? 10080 : 7;
      setCookie(`dontShowSurvey${selectedNovaTab}`, String(dontShowSurvey), minute);
    }

    handleOfferCredit().then(() => {
      showOfferCreditPopup();
    });
  };

  const handleOfferCredit = async () => {
    try {
      const { res, logger } = await apiWrapper().request(NOVA_CREDIT_OFFER, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creditType: 'AI_NOVA_FUNC_SATISFACTION_SURVEY',
          serviceType: service[0].serviceType
        }),
        method: 'POST'
      });

      const response = await res.json();
      if (response.success) {
        dispatch(
          setPageCreditReceivedByServiceType({
            serviceType: service[0].serviceType
          })
        );
        const log_info = getServiceLoggingInfo(service[0].serviceType);
        await logger({
          dp: 'ai.nova',
          dt: 'credit_event',
          el: 'feedback_send',
          type: result ?? '',
          detail_type: log_info.name,
          gpt_ver: log_info.detail
        });
      }
    } catch (error) {
      errHandle(error);
    }
  };

  const showOfferCreditPopup = () => {
    overlay.closeAll();

    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={close}>
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
            result === 'great'
              ? isLightMode
                ? GoodEnableLightIcon
                : GoodEnableDarkIcon
              : isLightMode
                ? GoodDisableLightIcon
                : GoodDisableDarkIcon
          }
          alt="good"
          onClick={() => setResult('great')}
        />
        <img
          src={
            result === 'sorry'
              ? isLightMode
                ? BadEnableLightIcon
                : BadEnableDarkIcon
              : isLightMode
                ? BadDisableLightIcon
                : BadDisableDarkIcon
          }
          alt="bad"
          onClick={() => setResult('sorry')}
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
