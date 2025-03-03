import { useEffect } from 'react';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next'; // 추가
import { getLangFromLangCode } from 'util/translation';

import { apiWrapper } from '../../../../../api/apiWrapper';
import { NOVA_GET_CREDIT_USE_COUNT } from '../../../../../api/constant';
import useErrorHandle from '../../../../../components/hooks/useErrorHandle';
import SurveyModalContent from '../../../../../components/nova/satisfactionSurvey/survey-modal-content';
import OverlayModal from '../../../../../components/overlay-modal';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { SERVICE_TYPE } from '../../../../../constants/serviceType';
import { selectPageCreditReceived } from '../../../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../../../store/slices/tabSlice';
import { useAppSelector } from '../../../../../store/store';
import { getCookie } from '../../../../../util/common';
import { useTranslationContext } from '../../provider/translation-provider';
import TranslationResultAction from '../translation-result-action';

import * as S from './style';

export default function TranslationTextResult() {
  const { t } = useTranslation(); // 추가
  const {
    sharedTranslationInfo: { translateInputValue, translatedText, targetLang, sourceLang }
  } = useTranslationContext();

  return (
    <>
      <S.Title>{t('Nova.translation.Button.TranslationComplete')}</S.Title>
      <TranslationResultAction
        translatedLang={getLangFromLangCode('source', sourceLang)}
        translatedValue={translateInputValue}
      />
      <S.Wrapper>
        <TranslationResultAction
          translatedLang={getLangFromLangCode('target', targetLang)}
          isInsertDocAction
          translatedValue={translatedText}
        />
      </S.Wrapper>
    </>
  );
}
