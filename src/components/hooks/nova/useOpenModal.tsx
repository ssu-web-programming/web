import useModal from './useModal';
import { useAppDispatch } from '../../../store/store';
import {
  IAccurePromotionAction,
  IEventType,
  IPromotionUserInfo,
  setPromotionUserInfo
} from '../../../store/slices/promotionUserInfo';
import { useCallback } from 'react';
import { apiWrapper } from '../../../api/apiWrapper';
import { PROMOTION_USER_INFO } from '../../../api/constant';

const useOpenModal = () => {
  const { openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();

  const initPromotionUserInfo = async () => {
    try {
      const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
      const { res } = await apiWrapper().request(PROMOTION_USER_INFO, {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          type: eventType
        }),
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        dispatch(setPromotionUserInfo(response.data.accurePromotionUser));
      }
    } catch (err) {}
  };

  const closeEvent = (
    type:
      | 'missionComplete'
      | 'prizeCredit'
      | 'notEnoughHeart'
      | 'nextChance'
      | 'prize'
      | 'luckyDrawComplete'
  ) => {
    closeModal(type);
    initPromotionUserInfo();
  };

  return useCallback(
    async (userInfo: IPromotionUserInfo) => {
      let type:
        | 'missionComplete'
        | 'prizeCredit'
        | 'notEnoughHeart'
        | 'nextChance'
        | 'prize'
        | 'luckyDrawComplete' = 'missionComplete';

      if (userInfo.status === 'VALID') {
        type = userInfo.point >= 30 ? 'missionComplete' : 'notEnoughHeart';
      } else if (userInfo.status === 'ALREADY_USED') {
        type = 'nextChance';
      } else if (userInfo.status === 'NO_AGREEMENT_DATA') {
        type = 'prize';
      }

      const handleModalOpen = async (
        modalType: typeof type,
        nextModalType?: typeof type,
        nextModalClose?: () => void
      ) => {
        openModal({
          type: modalType,
          props: {
            buttonOnClick: async () => {
              closeEvent(modalType);
              if (nextModalClose) nextModalClose();

              if (nextModalType) await handleModalOpen(nextModalType);
            }
          }
        });
      };

      switch (type) {
        case 'missionComplete':
        case 'notEnoughHeart':
        case 'nextChance':
          await handleModalOpen(type);
          break;
        case 'prize':
          await handleModalOpen(type, 'luckyDrawComplete');
          break;
      }
    },
    [openModal, closeModal]
  );
};

export default useOpenModal;
