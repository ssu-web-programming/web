import { ERR_NOT_ONLINE, ERR_INVALID_SESSION } from '../error/error';
import Bridge from '../util/bridge';
import { JSON_CONTENT_TYPE } from '../api/constant';
interface IBody {
  fileId: string;
  fileRevision: number;
}

const requestHandler = async <T = IBody>(api: string, requestBody: T) => {
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
      headers: {
        ...JSON_CONTENT_TYPE,
        'User-Agent': navigator.userAgent,
        ...session
      },
      body: JSON.stringify({
        ...requestBody
      }),
      method: 'POST'
    });
    const response = await res.json();
    return { ...response, credit: res?.headers?.get('Userinfo-Credit') };
  } catch (error: any) {
    throw error;
  }
};

export default requestHandler;
