import { encode } from 'gpt-tokenizer';
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
    dt?: string;
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

  input_token?: number;
  output_token?: number;
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
    dp: ''
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
    output_token: undefined
  }
};

const isVfMode = process.env.REACT_APP_USE_LOGGER_MODE_VF === 'true';
const useLogger = process.env.REACT_APP_USE_LOGGER_SPLUNK === 'true';
const usePostSplunkLog = (sessionInfo: SessionInfo) => {
  const logData = {
    ...DEFAULT_LOG_DATA,
    ctx: { ...DEFAULT_LOG_DATA.ctx, ...sessionInfo }
  };

  return async (data: SplunkData) => {
    if (!useLogger) return;

    logData.ctx.ts = parseInt(new Date().getTime().toString().substring(0, 10));
    logData.obj.dp = data.dp;

    logData.cobj.input_token = data.input_token;
    logData.cobj.output_token = data.output_token;
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
  let count = MAGIC_NUMBER;
  const encoded = encode(text);
  if (encoded) count += encoded.length;
  return count;
};

export default usePostSplunkLog;
