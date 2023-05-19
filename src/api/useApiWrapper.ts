import { setOnlineStatus } from '../store/slices/network';
import { useAppDispatch } from '../store/store';

const ERR_NOT_ONLINE = 'NotOnline';

export default function useApiWrapper() {
  const dispatch = useAppDispatch();
  return async function apiWrapper(api: string, option: any) {
    try {
      if (!navigator.onLine) {
        throw new Error(ERR_NOT_ONLINE);
      }
      const resSession = await window._Bridge.checkSession(api);
      if (!resSession || !resSession.success) {
        console.log(`apiWrapper[resSession] : ${JSON.stringify(resSession)}`);
        throw new Error('Error: Invlid Session');
      }

      const session: any = {};
      session['X-PO-AI-MayFlower-Auth-AID'] = resSession.sessionInfo['AID'];
      session['X-PO-AI-MayFlower-Auth-BID'] = resSession.sessionInfo['BID'];
      session['X-PO-AI-MayFlower-Auth-SID'] = resSession.sessionInfo['SID'];

      const _option = { ...option, headers: { ...option.headers, ...session } };
      const res = await fetch(api, _option);
      return res;
    } catch (err: any) {
      console.log(`apiWrapper : ${JSON.stringify(err)}`);
      if (err.message === ERR_NOT_ONLINE) {
        dispatch(setOnlineStatus(false));
        throw err;
      }
      throw err;
    }
  };
}
