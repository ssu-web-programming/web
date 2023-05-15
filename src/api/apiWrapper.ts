export default async function apiWrapper(api: string, option: any) {
  try {
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
  } catch (err) {
    console.log(`apiWrapper : ${JSON.stringify(err)}`);
    throw err;
  }
}
