import { apiWrapper } from 'api/apiWrapper';
import {
  AI_CREDIT_INFO,
  NOVA_GET_EXPIRED_TIME,
  NOVA_GET_USER_INFO_AGREEMENT,
  PROMOTION_USER_INFO
} from 'api/constant';
import { useCallback } from 'react';
import { setNovaExpireTime } from 'store/slices/appState';
import { setCreditInfo } from 'store/slices/creditInfo';
import { setNovaAgreement, setUserInfo } from 'store/slices/userInfo';
import { useAppDispatch } from 'store/store';
import { IEventType } from '../../store/slices/promotionUserInfo';

export default function useInitApp() {
  const dispatch = useAppDispatch();

  const initNovaExpireTime = useCallback(async () => {
    try {
      const { res } = await apiWrapper().request(NOVA_GET_EXPIRED_TIME, {
        method: 'GET'
      });
      const {
        success,
        data: { expiredTime } // seconds
      } = await res.json();
      if (success) {
        dispatch(setNovaExpireTime(expiredTime * 1000));
      }
    } catch (err) {}
  }, [dispatch]);

  const initUserInfo = useCallback(async () => {
    try {
      const { res, userInfo } = await apiWrapper().request(NOVA_GET_USER_INFO_AGREEMENT, {
        method: 'POST'
      });
      const {
        success,
        data: { agreement }
      } = await res.json();
      if (success) {
        dispatch(setNovaAgreement(agreement));
        dispatch(setUserInfo(userInfo));
      }
    } catch (err) {}
  }, [dispatch]);

  const initCreditInfo = useCallback(async () => {
    try {
      const { res } = await apiWrapper().request(AI_CREDIT_INFO, { method: 'POST' });
      const {
        success,
        data: { creditInfos }
      } = await res.json();
      if (success) dispatch(setCreditInfo(creditInfos));
    } catch (err) {}
  }, [dispatch]);

  const initPromotionUserInfo = useCallback(async () => {
    try {
      const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
      const { res } = await apiWrapper().request(PROMOTION_USER_INFO, {
        body: JSON.stringify({
          type: eventType
        }),
        method: 'POST'
      });
      const response = await res.json();
      if (response.resultCode === 0) {
        dispatch(setUserInfo(response));
      }
    } catch (err) {}
  }, [dispatch]);

  return () => {
    initNovaExpireTime();
    initPromotionUserInfo();
    initUserInfo();
    initCreditInfo();
  };
}
