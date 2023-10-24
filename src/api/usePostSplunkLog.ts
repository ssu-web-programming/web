import { encode } from 'gpt-tokenizer';
import { REC_ID_LIST } from '../components/chat/RecommendBox/FunctionRec';
import { EngineVersion } from '../components/chat/RecommendBox/FormRec';

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
  };
}

interface SessionInfo {
  bid: string;
  sid: string;

  us: string;
  uid: string;
  ul: string;
}

interface SplunkData {
  dp: string;

  el?: string;
  ec?: string;
  ea?: string;

  input_token?: number;
  output_token?: number;
  gpt_ver?: LLMVersion;
}

const DEFAULT_LOG_DATA: SplunkLogDataType = {
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
    gpt_ver: undefined
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

    logData.cobj.input_token = data.input_token;
    logData.cobj.output_token = data.output_token;
    logData.cobj.gpt_ver = data.gpt_ver;

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

export const parseGptVer = (version: EngineVersion): LLMVersion => {
  try {
    if (version === 'clovax') return 'CLOVA';
    const gptVer = new RegExp(/gpt([0-9]*[.]?[0-9]+)/g).exec(version);
    const gpt_ver = gptVer && gptVer[1] ? parseFloat(gptVer[1]) : 0;
    return gpt_ver;
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
