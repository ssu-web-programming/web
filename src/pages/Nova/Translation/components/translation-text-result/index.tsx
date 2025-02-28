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
  const errorHandle = useErrorHandle();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(NOVA_TAB_TYPE.translation));
  const {
    sharedTranslationInfo: { translateInputValue, translatedText, targetLang, sourceLang }
  } = useTranslationContext();

  useEffect(() => {
    // showSurveyModal();
  }, []);

  const showSurveyModal = async () => {
    // 만족도 이벤트
    if (!isCreditRecieved && !getCookie(`dontShowSurvey${selectedNovaTab}`)) {
      try {
        const { res } = await apiWrapper().request(NOVA_GET_CREDIT_USE_COUNT, {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            serviceTypes: [
              SERVICE_TYPE.NOVA_TRANSLATION_DEEPL,
              SERVICE_TYPE.NOVA_TRANSLATION_DEEPL_FILE
            ],
            startTime: '1740182400000',
            endTime: '1740528000000'
          }),
          method: 'POST'
        });

        const { data } = await res.json();
        if (data.creditUsecount >= 1) {
          overlay.closeAll();

          overlay.open(({ isOpen, close }) => {
            return (
              <OverlayModal isOpen={isOpen} onClose={close} padding={'24px'}>
                <SurveyModalContent />
              </OverlayModal>
            );
          });
        }
      } catch (error) {
        errorHandle(error);
      }
    }
  };

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
