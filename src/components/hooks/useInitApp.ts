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
import { setIsNotLogin, setNovaExpireTime } from 'store/slices/appState';
import { setNovaAgreement, setUserInfo } from 'store/slices/userInfo';
import { useAppDispatch } from 'store/store';
import Bridge, { CheckSessionResponse } from 'util/bridge';

import { init } from '@amplitude/analytics-browser';

import usePostSplunkLog from '../../api/usePostSplunkLog';
import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';
import { IOfferCredit } from '../../constants/offerCredit';
import { SERVICE_TYPE, TAB_SERVICE_MAP } from '../../constants/serviceType';
import { ClientStatusType } from '../../pages/Nova/Nova';
import { setCreditInfo } from '../../store/slices/creditInfo';
import { initComplete } from '../../store/slices/initFlagSlice';
import { setAnnounceInfo } from '../../store/slices/nova/announceSlice';
import {
  PageService,
  PageStatus,
  setPageCreditReceivedByServiceType,
  setPageService
} from '../../store/slices/nova/pageStatusSlice';

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
          const time = process.env.NODE_ENV == 'production' ? expiredTime * 1000 : 72000;
          dispatch(setNovaExpireTime(time));
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
                  deductCredit: service.deductCredit,
                  isUsed: false
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
          dispatch(setCreditInfo(creditInfos));
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
        dispatch(setAnnounceInfo(announcementInfos));
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
    let resSession: CheckSessionResponse | null = null;

    try {
      resSession = (await Bridge.checkSession('app init')) as CheckSessionResponse;
    } catch (e) {
      console.warn('[checkSession] failed (ignored):', e);
      resSession = null;
    }

    if (!resSession || !resSession.success) {
      dispatch(setIsNotLogin(true));
      return;
    }

    const { sessionInfo, userInfo } = resSession;

    const AID = sessionInfo['AID'];
    const BID = sessionInfo['BID'];
    const SID = sessionInfo['SID'];

    const session: any = {};
    session['X-PO-AI-MayFlower-Auth-AID'] = AID;
    session['X-PO-AI-MayFlower-Auth-BID'] = BID;
    session['X-PO-AI-MayFlower-Auth-SID'] = SID;

    const headers = {
      ...session,
      'User-Agent': navigator.userAgent,
      'X-PO-AI-API-LANGUAGE': lang
    };

    await Promise.all([
      initCreditInfo(headers),
      initUserInfo(headers),
      initAnnouncementInfo(headers),
      initNovaExpireTime(headers)
    ]);
    await initOfferList(headers);

    dispatch(
      initComplete({
        isInit: true
      })
    );

    dispatch(setUserInfo(userInfo));

    console.log('sdfksdjkfljsdkljkdsf');
    Bridge.callSyncBridgeApiWithCallback({
      api: 'getClientStatus',
      callback: async (status: ClientStatusType) => {
        const logger = usePostSplunkLog({ bid: BID, sid: SID, ...userInfo });
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
