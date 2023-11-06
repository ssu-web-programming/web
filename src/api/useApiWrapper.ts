import { ERR_INVALID_SESSION, ERR_NOT_ONLINE } from '../error/error';
import Bridge from '../util/bridge';
import usePostSplunkLog from './usePostSplunkLog';

export default function useApiWrapper() {
  return async function apiWrapper(api: string, option: any, logger = usePostSplunkLog) {
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

      const _option = { ...option, headers: { ...option.headers, ...session } };
      const res = await fetch(api, _option);
      return {
        res,
        logger: logger({ bid: BID, sid: SID, ...resSession.userInfo }),
        userInfo: resSession.userInfo
      };
    } catch (err: any) {
      throw err;
    }
  };
}
