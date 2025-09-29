import { encode } from 'gpt-tokenizer';
import { VersionType } from 'store/slices/txt2imgHistory';

import { EngineVersion } from '../components/chat/RecommendBox/FormRec';
import { REC_ID_LIST } from '../components/chat/RecommendBox/FunctionRec';
import { CheckSessionResponse } from '../util/bridge';

export type LLMVersion = string | number;

interface SplunkLogDataType {
  ti: {
    v: string;
    t: string;
  };
  ui: {
    ua: string;
    ip: string;
    us: string;
    uid: string;
    ul: string;
  };
  obj: {
    dc: string;
    dp: string;
    el?: string;
    dt?: string;
    ec?: string;
    ea?: string;
  };
  ctx: {
    ts: number;
    bid: string;
    sid: string;
    svc: string;
    nos: boolean;
  };
  cobj: {
    input_token?: number;
    output_token?: number;
    env?: string;
    gpt_ver?: LLMVersion;
    file_type?: string;
    type?: string;
    detail_type?: string;
  };
}

interface SessionInfo {
  bid: string;
  sid: string;

  us: string;
  uid: string;
  ul: string;
}

export interface SplunkData {
  dp: string;

  el?: string;
  ec?: string;
  ea?: string;
  t?: string;

  input_token?: number;
  output_token?: number;
  gpt_ver?: LLMVersion;
  type?: string;
  detail_type?: string;

  dt?: string;

  file_type?: string;
}

export const DEFAULT_LOG_DATA: SplunkLogDataType = {
  ti: {
    v: '1.1',
    t: 'e'
  },
  ui: {
    ua: navigator.userAgent,
    ip: '0.0.0.0',
    us: '',
    uid: '',
    ul: ''
  },
  obj: {
    dc: Math.floor(Math.random() * 10000000000000000).toString(),
    dp: '',
    dt: undefined,
    el: undefined
  },
  ctx: {
    ts: 0,
    bid: '',
    sid: '',
    svc: 'global',
    nos: true
  },
  cobj: {
    input_token: undefined,
    output_token: undefined,
    gpt_ver: undefined,
    file_type: undefined
  }
};

const isVfMode = process.env.REACT_APP_USE_LOGGER_MODE_VF === 'true';
const useLogger = process.env.REACT_APP_USE_LOGGER_SPLUNK === 'true';
const usePostSplunkLog = (sessionInfo: SessionInfo) => {
  const logData = {
    ...DEFAULT_LOG_DATA,
    ctx: { ...DEFAULT_LOG_DATA.ctx, bid: sessionInfo.bid, sid: sessionInfo.sid },
    ui: { ...DEFAULT_LOG_DATA.ui, us: sessionInfo.us, uid: sessionInfo.uid, ul: sessionInfo.ul }
  };

  return async (data: SplunkData) => {
    if (!useLogger) return;

    logData.ctx.ts = parseInt(new Date().getTime().toString().substring(0, 10));
    logData.obj.dp = data.dp;
    logData.obj.el = data.el;
    logData.obj.ec = data.ec;
    logData.obj.ea = data.ea;
    logData.obj.dt = data.dt;
    logData.ti.t = data.t ? data.t : DEFAULT_LOG_DATA.ti.t;

    logData.cobj.input_token = data.input_token;
    logData.cobj.output_token = data.output_token;
    logData.cobj.gpt_ver = data.gpt_ver;
    logData.cobj.file_type = data.file_type;
    logData.cobj.type = data.type;
    logData.cobj.detail_type = data.detail_type;

    if (isVfMode) logData.cobj.env = 'vf';

    const res = await fetch('https://log.polarisoffice.com/api/2/logcollect/collector', {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(logData),
      method: 'POST'
    });

    return res;
  };
};

const convertSessionInfo = (response: CheckSessionResponse) => ({
  bid: response.sessionInfo.BID,
  sid: response.sessionInfo.SID,
  ...response.userInfo
});

export const postSplunkLog = async (sessionResponse: CheckSessionResponse, data: SplunkData) => {
  try {
    if (!useLogger) return;

    const sessionInfo = convertSessionInfo(sessionResponse);
    const logData = {
      ...DEFAULT_LOG_DATA,
      ctx: { ...DEFAULT_LOG_DATA.ctx, bid: sessionInfo.bid, sid: sessionInfo.sid },
      ui: { ...DEFAULT_LOG_DATA.ui, us: sessionInfo.us, uid: sessionInfo.uid, ul: sessionInfo.ul }
    };

    logData.ctx.ts = parseInt(new Date().getTime().toString().substring(0, 10));
    logData.obj.dp = data.dp;
    logData.obj.el = data.el;
    logData.obj.ec = data.ec;
    logData.obj.ea = data.ea;
    logData.obj.dt = data.dt;
    logData.ti.t = data.t ? data.t : DEFAULT_LOG_DATA.ti.t;

    logData.cobj.input_token = data.input_token;
    logData.cobj.output_token = data.output_token;
    logData.cobj.gpt_ver = data.gpt_ver;
    logData.cobj.type = data.type;
    logData.cobj.detail_type = data.detail_type;

    if (isVfMode) logData.cobj.env = 'vf';

    const res = await fetch('https://log.polarisoffice.com/api/2/logcollect/collector', {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(logData),
      method: 'POST'
    });

    return res;
  } catch (err) {
    /*empty*/
  }
};

const MAGIC_NUMBER = 8;
export const calcToken = (text: string) => {
  try {
    let count = MAGIC_NUMBER;
    const encoded = encode(text);
    if (encoded) count += encoded.length;
    return count;
  } catch (err) {
    return 0;
  }
};

export const parseGptVer = (version: EngineVersion | VersionType): LLMVersion => {
  try {
    if (version === 'clovax') return 'CLOVA';
    // else if (version === 'claude') return 'claude3';
    else if (version === 'sd3') return 'Stable_Diffusion';
    else if (version === 'dalle3') return 'Dalle-3';
    const gptVer = new RegExp(/gpt([0-9]*[.]?[0-9]+[a-z]?)/g).exec(version);
    return gptVer && gptVer[1] ? gptVer[1] : 0;
  } catch (err) {
    return 'unknown';
  }
};

export const getElValue = (select: string | undefined) => {
  switch (select) {
    case REC_ID_LIST.RESUME_WRITING:
      return 'chat_overwrite';
    case REC_ID_LIST.SUMMARY:
      return 'chat_summary';
    case REC_ID_LIST.TRANSLATE:
      return 'chat_translation';
    case REC_ID_LIST.CHANGE_TEXT_STYLE:
      return 'chat_changestyle';
    case REC_ID_LIST.MODIFY_TEXT:
      return 'chat_modifyspelling';
    default:
      return 'chat_general';
  }
};

export default usePostSplunkLog;
