import useModal from './useModal';
import { useAppDispatch } from '../../../store/store';
import Bridge from '../../../util/bridge';
import {
  IAccurePromotionAction,
  IEventType,
  IPromotionUserInfo,
  setPromotionUserInfo
} from '../../../store/slices/promotionUserInfo';
import { useCallback, useEffect } from 'react';
import { apiWrapper } from '../../../api/apiWrapper';
import { PROMOTION_OFFER, PROMOTION_USER_INFO } from '../../../api/constant';

const useOpenModal = () => {
  const { openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();

  const initPromotionUserInfo = useCallback(async () => {
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
  }, [dispatch]);

  const closeEvent = (
    type:
      | 'missionComplete'
      | 'prizeCredit'
      | 'notEnoughHeart'
      | 'nextChance'
      | 'prize'
      | 'luckyDrawComplete'
  ) => {
    Bridge.callBridgeApi('closePanel', 'shutDown');
    closeModal(type);
    dispatch(
      setPromotionUserInfo({
        type: -1,
        accureAction: [],
        idUser: '',
        timeUpdate: 0,
        timeRegist: 0,
        point: 0,
        status: null
      })
    );
    initPromotionUserInfo();
  };

  const OfferEvent = async (userInfo: IPromotionUserInfo) => {
    try {
      const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
      const { res } = await apiWrapper().request(PROMOTION_OFFER, {
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
        const accureAction =
          response.data.result.accure.length > 0
            ? response.data.result.accure
            : IAccurePromotionAction.UNKNOWN;
        initPromotionUserInfo();

        return accureAction === IAccurePromotionAction.UNKNOWN ? 'prizeCredit' : 'prize';
      }
    } catch (err) {
      console.error('OfferEvent error:', err);
      return null;
    }
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

              if (modalType === 'missionComplete') {
                const type = await OfferEvent(userInfo);
                if (type) await handleModalOpen(type);
              }
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
