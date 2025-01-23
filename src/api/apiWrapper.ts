import {
  DelayDocConverting,
  ERR_INVALID_SESSION,
  ERR_NOT_ONLINE,
  ExceedPoDriveLimitError,
  INVALID_PROMPT,
  NoCreditError,
  NoFileInDrive,
  NovaNoCreditError
} from '../error/error';
import { lang } from '../locale';
import store from '../store/store';
import Bridge from '../util/bridge';
import { calLeftCredit } from '../util/common';

import {
  AI_WRITE_RESPONSE_STREAM_API,
  ALLI_RESPONSE_STREAM_API,
  NOVA_CHAT_API,
  PO_DRIVE_CONVERT_STATUS,
  PO_DRIVE_DOWNLOAD,
  PO_DRIVE_UPLOAD,
  TEXT_TO_IMAGE_API
} from './constant';
import usePostSplunkLog from './usePostSplunkLog';

interface ApiInit extends RequestInit {
  body?: any;
}

export function apiWrapper() {
  const abortController = new AbortController();

  const waitForInitComplete = () => {
    return new Promise<void>((resolve) => {
      const isInitComplete = store.getState().initFlagSlice.isInit;
      if (isInitComplete) {
        resolve();
        return;
      }

      const unsubscribe = store.subscribe(() => {
        const updatedIsInitComplete = store.getState().initFlagSlice.isInit;

        if (updatedIsInitComplete) {
          unsubscribe();
          resolve();
        }
      });
    });
  };

  const request = async function (api: string, init: ApiInit, logger = usePostSplunkLog) {
    await waitForInitComplete();

    if (!navigator.onLine) {
      throw new Error(ERR_NOT_ONLINE);
    }
    const resSession = await Bridge.checkSession(api);
    if (!resSession || !resSession.success) {
      throw new Error(ERR_INVALID_SESSION);
    }

    console.log('resSession', resSession);
    const AID = resSession.sessionInfo['AID'];
    const BID = resSession.sessionInfo['BID'];
    const SID = resSession.sessionInfo['SID'];

    const session: any = {};
    session['X-PO-AI-MayFlower-Auth-AID'] = AID;
    session['X-PO-AI-MayFlower-Auth-BID'] = BID;
    session['X-PO-AI-MayFlower-Auth-SID'] = SID;

    const res = await fetch(api, {
      ...init,
      signal: abortController.signal,
      headers: {
        'User-Agent': navigator.userAgent,
        'X-PO-AI-API-LANGUAGE': lang,
        ...session,
        ...init.headers
      }
    });

    if (res.status !== 200) {
      if (
        api === AI_WRITE_RESPONSE_STREAM_API ||
        api === TEXT_TO_IMAGE_API ||
        api === ALLI_RESPONSE_STREAM_API ||
        api === NOVA_CHAT_API
      ) {
        if (!res.ok && res.status === 429) {
          if (api === NOVA_CHAT_API) {
            const body = await res.json();
            throw new NovaNoCreditError({
              current: body?.error?.code === 'no_credit' ? 0 : 1,
              necessary: 0
            });
          }
          const { leftCredit, deductionCredit } = calLeftCredit(res.headers);
          const current = parseInt(leftCredit ?? '0');
          const necessary = parseInt(deductionCredit ?? '0');

          throw new NoCreditError({
            current,
            necessary
          });
        }

        const body = await res.json();
        if (body?.error?.code === 'invalid_prompt') throw new Error(INVALID_PROMPT);

        throw res;
      } else if (api === PO_DRIVE_DOWNLOAD) {
        throw new NoFileInDrive();
      } else if (api === PO_DRIVE_CONVERT_STATUS) {
        throw new DelayDocConverting();
      }
    }

    if (api === PO_DRIVE_UPLOAD && res.status === 400) {
      const body = await res.json();
      if (body?.error?.code === '100') throw new ExceedPoDriveLimitError();
      throw res;
    }

    return {
      res,
      logger: logger({ bid: BID, sid: SID, ...resSession.userInfo }),
      userInfo: resSession.userInfo
    };
  };

  const abort = () => abortController.abort();

  const isAborted = () => abortController.signal.aborted;

  return {
    request,
    abort,
    isAborted
  };
}

export const streaming = async (
  res: Response,
  output: (contents: string) => void,
  parser = (data: string) => data
) => {
  const reader = res.body?.getReader();
  const enc = new TextDecoder('utf-8');

  while (reader) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    const decodeStr = enc.decode(value);
    const parsed = parser(decodeStr);
    output(parsed);
  }
};
