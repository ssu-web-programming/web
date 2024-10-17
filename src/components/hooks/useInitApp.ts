import { useCallback } from 'react';
import {
  AI_CREDIT_INFO,
  NOVA_GET_ANNOUNCEMENT,
  NOVA_GET_EXPIRED_TIME,
  NOVA_GET_USER_INFO_AGREEMENT
} from 'api/constant';
import { ERR_INVALID_SESSION } from 'error/error';
import { lang, langCode } from 'locale';
import { setNovaExpireTime } from 'store/slices/appState';
import { setCreditInfo } from 'store/slices/creditInfo';
import { setNovaAgreement, setUserInfo } from 'store/slices/userInfo';
import { useAppDispatch } from 'store/store';
import Bridge from 'util/bridge';

import { setAnnounceInfo, tabTypeMap } from '../../store/slices/nova/announceSlice';

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
      } catch (err) {
        /* empty */
      }
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
      } catch (err) {
        /* empty */
      }
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
      } catch (err) {
        /* empty */
      }
    },
    [dispatch]
  );

  const initAnnouncementInfo = useCallback(
    async (headers: HeadersInit) => {
      for (const [tab, value] of Object.entries(tabTypeMap)) {
        try {
          const res = await fetch(NOVA_GET_ANNOUNCEMENT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...headers
            },
            body: JSON.stringify({ type: value, language: langCode })
          });
          const {
            data: { announcementInfos }
          } = await res.json();
          dispatch(
            setAnnounceInfo({
              tab: tab,
              info: { ...announcementInfos, isShow: announcementInfos.status }
            })
          );
        } catch (err) {
          /* empty */
        }
      }
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

    await initUserInfo(headers);
    await initNovaExpireTime(headers);
    await initCreditInfo(headers);
    await initAnnouncementInfo(headers);

    dispatch(setUserInfo(resSession.userInfo));
  };
}
