import React from 'react';
import { overlay } from 'overlay-kit';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { PageService } from '../../../store/slices/nova/pageStatusSlice';
import { getCookie } from '../../../util/common';
import SurveyModalContent from '../../nova/satisfactionSurvey/survey-modal-content';
import OverlayModal from '../../overlay-modal';

export default function UseShowSurveyModal() {
  const showSurveyModal = async (
    selectedNovaTab: NOVA_TAB_TYPE,
    services: PageService,
    isCreditRecieved: boolean
  ) => {
    console.log('selectedNovaTab: ', selectedNovaTab);
    console.log('isCreditRecieved: ', isCreditRecieved);
    console.log('dontShowSurvey: ', getCookie(`dontShowSurvey${selectedNovaTab}`));
    console.log('closeSurvey: ', getCookie(`closeSurvey${selectedNovaTab}`));
    console.log(
      'isUsed: ',
      services.some((service) => service.isUsed)
    );
    // 만족도 이벤트
    if (
      !isCreditRecieved &&
      !getCookie(`dontShowSurvey${selectedNovaTab}`) &&
      !getCookie(`closeSurvey${selectedNovaTab}`) &&
      services.some((service) => service.isUsed)
    ) {
      overlay.closeAll();

      overlay.open(({ isOpen, close }) => {
        return (
          <OverlayModal isOpen={isOpen} onClose={close}>
            <SurveyModalContent />
          </OverlayModal>
        );
      });
      return true;
    } else {
      return false;
    }
  };

  return showSurveyModal;
}
