import { ERR_INVALID_SESSION, ERR_NOT_ONLINE } from '../error/error';
import Bridge from '../util/bridge';
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
          ...session,
          ...init.headers
        },
        body: JSON.stringify(init.body)
      });

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
