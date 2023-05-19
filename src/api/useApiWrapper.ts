import { ERR_INVALID_SESSION, ERR_NOT_ONLINE } from '../error/error';

export default function useApiWrapper() {
  return async function apiWrapper(api: string, option: any) {
    try {
      if (!navigator.onLine) {
        throw new Error(ERR_NOT_ONLINE);
      }
      const resSession = await window._Bridge.checkSession(api);
      if (!resSession || !resSession.success) {
        console.log(`apiWrapper[resSession] : ${JSON.stringify(resSession)}`);
        throw new Error(ERR_INVALID_SESSION);
      }

      const session: any = {};
      session['X-PO-AI-MayFlower-Auth-AID'] = resSession.sessionInfo['AID'];
      session['X-PO-AI-MayFlower-Auth-BID'] = resSession.sessionInfo['BID'];
      session['X-PO-AI-MayFlower-Auth-SID'] = resSession.sessionInfo['SID'];

      const _option = { ...option, headers: { ...option.headers, ...session } };
      const res = await fetch(api, _option);
      return res;
    } catch (err: any) {
      throw err;
    }
  };
}
