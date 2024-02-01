import { EngineVersion } from '../components/chat/RecommendBox/FormRec';
import { GPT_EXCEEDED_LIMIT } from '../error/error';
import { Chat, ChatResultType, StreamPreprocessing } from '../store/slices/chatHistorySlice';
import { CheckSessionResponse } from '../util/bridge';
import { ALLI_RESPONSE_STREAM_API, AI_WRITE_RESPONSE_STREAM_API } from './constant';

const requestApi = async (api: string, init: RequestInit) => await fetch(api, init);

const makeSessionHeader = (sessionInfo: CheckSessionResponse) => {
  const session: any = {};
  session['X-PO-AI-MayFlower-Auth-AID'] = sessionInfo.sessionInfo['AID'];
  session['X-PO-AI-MayFlower-Auth-BID'] = sessionInfo.sessionInfo['BID'];
  session['X-PO-AI-MayFlower-Auth-SID'] = sessionInfo.sessionInfo['SID'];

  return session;
};

interface ChatStreamContents extends Pick<Chat, 'role'> {
  content: ChatResultType;
  preProcessing?: StreamPreprocessing;
}

interface AiWriteChatStreamArg {
  api: typeof AI_WRITE_RESPONSE_STREAM_API;
  arg: {
    engine?: EngineVersion;
    history: ChatStreamContents[];
  };
}

interface AlliChatStreamArg {
  api: typeof ALLI_RESPONSE_STREAM_API;
  arg: {
    appId: string;
    inputs: any;
    lang: string;
  };
}

type ChatStreamArg = AiWriteChatStreamArg | AlliChatStreamArg;

export interface Requestor {
  request: () => Promise<Response>;
  abort: () => void;
  isAborted: () => boolean;
}

export const requestChatStream = (session: CheckSessionResponse, arg: ChatStreamArg): Requestor => {
  const abortController = new AbortController();
  const request = async () => {
    try {
      const sessionHeader = makeSessionHeader(session);
      const init = {
        signal: abortController.signal,
        headers: {
          'content-type': 'application/json',
          'User-Agent': navigator.userAgent,
          ...sessionHeader
        },
        body: JSON.stringify(arg.arg),
        method: 'POST'
      };

      const response = await requestApi(arg.api, init);

      if (response.status !== 200) {
        if (response.status === 400) throw new Error(GPT_EXCEEDED_LIMIT);
        else throw response;
      }

      return response;
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
};

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
