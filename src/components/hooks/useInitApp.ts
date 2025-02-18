import { useCallback } from 'react';
import {
  AI_CREDIT_INFO,
  NOVA_CREDIT_OFFER_LIST,
  NOVA_GET_ANNOUNCEMENT_LIST,
  NOVA_GET_EXPIRED_TIME,
  NOVA_GET_USER_INFO_AGREEMENT
} from 'api/constant';
import { ERR_INVALID_SESSION } from 'error/error';
import { lang, langFormatCode } from 'locale';
import { setNovaExpireTime } from 'store/slices/appState';
import { setCreditInfo } from 'store/slices/creditInfo';
import { setNovaAgreement, setUserInfo } from 'store/slices/userInfo';
import { useAppDispatch } from 'store/store';
import Bridge, { ClientType, getDevice, getPlatform, getVersion } from 'util/bridge';

import { init } from '@amplitude/analytics-browser';

import usePostSplunkLog from '../../api/usePostSplunkLog';
import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';
import { IOfferCredit } from '../../constants/offerCredit';
import { SERVICE_TYPE, TAB_SERVICE_MAP } from '../../constants/serviceType';
import { ClientStatusType } from '../../pages/Nova/Nova';
import { initComplete } from '../../store/slices/initFlagSlice';
import { IAnnouceInfo, setAnnounceInfo, tabTypeMap } from '../../store/slices/nova/announceSlice';
import {
  PageService,
  PageStatus,
  setPageCreditReceivedByServiceType,
  setPageService,
  setPageStatus
} from '../../store/slices/nova/pageStatusSlice';
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
        if (success) {
          const filteredServices = Object.keys(NOVA_TAB_TYPE).reduce(
            (acc, tab) => {
              const allowedServices = TAB_SERVICE_MAP[tab as NOVA_TAB_TYPE] || [];

              const services = (creditInfos || [])
                .filter((service: any) =>
                  allowedServices.includes(service.serviceType as SERVICE_TYPE)
                )
                .map((service: any) => ({
                  serviceType: service.serviceType as SERVICE_TYPE,
                  deductCredit: service.deductCredit
                }));

              return {
                ...acc,
                [tab]: services
              };
            },
            {} as { [K in keyof PageStatus]: PageService }
          );

          Object.keys(NOVA_TAB_TYPE).forEach((tab) => {
            dispatch(
              setPageService({
                tab: tab as NOVA_TAB_TYPE,
                services: filteredServices[tab as keyof PageStatus] || []
              })
            );
          });
        }
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
          body: JSON.stringify({ language: langFormatCode })
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

  const initOfferList = useCallback(
    async (headers: HeadersInit) => {
      try {
        const res = await fetch(NOVA_CREDIT_OFFER_LIST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify({ creditType: 'AI_NOVA_FUNC_SATISFACTION_SURVEY' })
        });
        const {
          data: { offerCreditList }
        } = await res.json();
        offerCreditList.forEach((offerCredit: IOfferCredit) => {
          const description = offerCredit.description;
          dispatch(
            setPageCreditReceivedByServiceType({ serviceType: description as SERVICE_TYPE })
          );
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

    await Promise.all([
      initCreditInfo(headers),
      initUserInfo(headers),
      initOfferList(headers),
      initAnnouncementInfo(headers),
      initNovaExpireTime(headers)
    ]);

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
