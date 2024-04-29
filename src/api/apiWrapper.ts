import { ERR_INVALID_SESSION, ERR_NOT_ONLINE, INVALID_PROMPT, NoCreditError } from '../error/error';
import { lang } from '../locale';
import Bridge from '../util/bridge';
import { calLeftCredit } from '../util/common';
import { AI_WRITE_RESPONSE_STREAM_API, TEXT_TO_IMAGE_API } from './constant';
import usePostSplunkLog from './usePostSplunkLog';

interface ApiInit extends RequestInit {
  body?: any;
}

export function apiWrapper() {
  const abortController = new AbortController();

  const request = async function (api: string, init: ApiInit, logger = usePostSplunkLog) {
    try {
      if (!navigator.onLine) {
        throw new Error(ERR_NOT_ONLINE);
      }
      const resSession = await Bridge.checkSession(api);
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

      const res = await fetch(api, {
        ...init,
        signal: abortController.signal,
        headers: {
          'User-Agent': navigator.userAgent,
          'content-type': 'application/json',
          'X-PO-AI-API-LANGUAGE': lang,
          ...session,
          ...init.headers
        },
        body: JSON.stringify(init.body)
      });

      if (
        (api === AI_WRITE_RESPONSE_STREAM_API || api === TEXT_TO_IMAGE_API) &&
        res.status !== 200
      ) {
        if (res.ok === false && res.status === 429) {
          const { leftCredit: current, deductionCredit: necessary } = calLeftCredit(res.headers);
          throw new NoCreditError({ current, necessary });
        }

        const body = await res.json();
        if (body?.error?.code === 'invalid_prompt') throw new Error(INVALID_PROMPT);

        throw res;
      }

      return {
        res,
        logger: logger({ bid: BID, sid: SID, ...resSession.userInfo }),
        userInfo: resSession.userInfo
      };
    } catch (err) {
      throw err;
    }
  };

  const abort = () => abortController.abort();

  const isAborted = () => abortController.signal.aborted;

  return {
    request,
    abort,
    isAborted
  };
}

export const streaming = async (res: Response, output: (contents: string) => void) => {
  const reader = res.body?.getReader();
  const enc = new TextDecoder('utf-8');

  while (reader) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    const decodeStr = enc.decode(value);
    output(decodeStr);
  }
};
