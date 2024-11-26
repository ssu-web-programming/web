import { useCallback } from 'react';
import {
  AI_CREDIT_INFO,
  NOVA_GET_ANNOUNCEMENT_LIST,
  NOVA_GET_EXPIRED_TIME,
  NOVA_GET_USER_INFO_AGREEMENT
} from 'api/constant';
import { ERR_INVALID_SESSION } from 'error/error';
import { lang, langCode } from 'locale';
import { setNovaExpireTime } from 'store/slices/appState';
import { setCreditInfo } from 'store/slices/creditInfo';
import { setNovaAgreement, setUserInfo } from 'store/slices/userInfo';
import { useAppDispatch } from 'store/store';
import Bridge, { ClientType, getDevice, getPlatform, getVersion } from 'util/bridge';

import { init } from '@amplitude/analytics-browser';

import usePostSplunkLog from '../../api/usePostSplunkLog';
import { ClientStatusType } from '../../pages/Nova/Nova';
import { initComplete } from '../../store/slices/initFlagSlice';
import { IAnnouceInfo, setAnnounceInfo, tabTypeMap } from '../../store/slices/nova/announceSlice';
import { setPageStatus } from '../../store/slices/nova/pageStatusSlice';
import { setPlatformInfo } from '../../store/slices/platformInfo';

export default function useInitApp() {
  const dispatch = useAppDispatch();

  const platform = getPlatform();
  const version = getVersion();
  const device = getDevice();

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
      try {
        const res = await fetch(NOVA_GET_ANNOUNCEMENT_LIST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify({ language: langCode })
        });
        const {
          data: { announcementInfos }
        } = await res.json();
        announcementInfos.forEach((announcement: IAnnouceInfo) => {
          const { type } = announcement;
          const tab = Object.keys(tabTypeMap).find(
            (key) => tabTypeMap[key as keyof typeof tabTypeMap] === type
          );
          if (tab) {
            dispatch(
              setAnnounceInfo({
                tab: tab,
                info: { ...announcement }
              })
            );
          }
        });
      } catch (err) {
        /* empty */
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

    if (platform != ClientType.unknown && version) {
      dispatch(setPlatformInfo({ platform: platform, device: device, version: version }));
    }
    dispatch(setPageStatus({ tab: 'aiChat', status: 'home' }));

    await initCreditInfo(headers);
    await initUserInfo(headers);
    await initAnnouncementInfo(headers);
    await initNovaExpireTime(headers);

    dispatch(
      initComplete({
        isInit: true
      })
    );

    dispatch(setUserInfo(resSession.userInfo));

    Bridge.callSyncBridgeApiWithCallback({
      api: 'getClientStatus',
      callback: async (status: ClientStatusType) => {
        const logger = usePostSplunkLog({ bid: BID, sid: SID, ...resSession.userInfo });
        await logger({
          dp: 'ai.nova',
          el: status === 'home' ? 'home_intobox' : 'document_intobox'
        });
      }
    });

    const apiKey = process.env.REACT_APP_AMPLITUDE_API_KEY;
    if (apiKey) {
      init(apiKey, {
        autocapture: false,
        userId: resSession.userInfo.uid
      });
    }
  };
}
