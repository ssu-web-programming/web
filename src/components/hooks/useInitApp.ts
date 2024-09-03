import { apiWrapper } from 'api/apiWrapper';
import { ERR_INVALID_SESSION } from 'error/error';
import { lang } from 'locale';
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
import { setPromotionUserInfo } from '../../store/slices/promotionUserInfo';
import { useAppDispatch } from 'store/store';
import { IEventType } from '../../store/slices/promotionUserInfo';
import Bridge from 'util/bridge';

export default function useInitApp() {
  const dispatch = useAppDispatch();

  const initNovaExpireTime = useCallback(
    async (headers: HeadersInit) => {
      try {
        const res = await fetch(NOVA_GET_EXPIRED_TIME, {
          method: 'GET',
          headers: {
            ...headers
          }
        });
        const {
          success,
          data: { expiredTime } // seconds
        } = await res.json();
        if (success) {
          dispatch(setNovaExpireTime(expiredTime * 1000));
        }
      } catch (err) {}
    },
    [dispatch]
  );

  const initUserInfo = useCallback(
    async (headers: HeadersInit) => {
      try {
        const res = await fetch(NOVA_GET_USER_INFO_AGREEMENT, {
          method: 'POST',
          headers: {
            ...headers
          }
        });
        const {
          success,
          data: { agreement }
        } = await res.json();
        if (success) {
          dispatch(setNovaAgreement(agreement));
        }
      } catch (err) {}
    },
    [dispatch]
  );

  const initCreditInfo = useCallback(
    async (headers: HeadersInit) => {
      try {
        const res = await fetch(AI_CREDIT_INFO, {
          method: 'POST',
          headers: {
            ...headers
          }
        });
        const {
          success,
          data: { creditInfos }
        } = await res.json();
        if (success) dispatch(setCreditInfo(creditInfos));
      } catch (err) {}
    },
    [dispatch]
  );

  const initPromotionUserInfo = useCallback(
    async (headers: HeadersInit) => {
      try {
        const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
        const res = await fetch(PROMOTION_USER_INFO, {
          headers: {
            ...headers,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            type: eventType
          }),
          method: 'POST'
        });
        const {
          success,
          data: { accurePromotionUser }
        } = await res.json();
        if (success.success) {
          dispatch(setPromotionUserInfo(accurePromotionUser));
        }
      } catch (err) {}
    },
    [dispatch]
  );

  return async () => {
    const resSession = await Bridge.checkSession('app init');
    if (!resSession || !resSession.success) {
      throw new Error(ERR_INVALID_SESSION);
    }

    const AID = resSession.sessionInfo['AID'];
    const BID = resSession.sessionInfo['BID'];
    const SID = resSession.sessionInfo['SID'];

    const session: any = {};
    session['X-PO-AI-MayFlower-Auth-AID'] = AID;
    session['X-PO-AI-MayFlower-Auth-BID'] = BID;
    session['X-PO-AI-MayFlower-Auth-SID'] = SID;

    const headers = {
      ...session,
      'User-Agent': navigator.userAgent,
      'X-PO-AI-API-LANGUAGE': lang
    };

    initUserInfo(headers);
    initNovaExpireTime(headers);
    initPromotionUserInfo(headers);
    initCreditInfo(headers);

    dispatch(setUserInfo(resSession.userInfo));
  };
}
