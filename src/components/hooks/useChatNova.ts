import { apiWrapper } from 'api/apiWrapper';
import { NOVA_DELETE_CONVERSATION } from 'api/constant';
import {
  initNovaHistory,
  NovaChatType,
  novaHistorySelector,
  setChatMode
} from 'store/slices/nova/novaHistorySlice';
import { selectTabSlice, setCreating, setUsingAI } from 'store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from 'store/store';

import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';
import { SERVICE_TYPE } from '../../constants/serviceType';
import { setPageStatus } from '../../store/slices/nova/pageStatusSlice';

export const useChatNova = () => {
  const dispatch = useAppDispatch();

  const newChat = async (selectedNovaTab: NOVA_TAB_TYPE, novaHistory: NovaChatType[]) => {
    try {
      const lastChat = novaHistory[novaHistory.length - 1];
      apiWrapper().request(NOVA_DELETE_CONVERSATION, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ threadId: lastChat.threadId })
      });
      dispatch(initNovaHistory());
      dispatch(setCreating('none'));
      dispatch(setUsingAI(false));
      if (selectedNovaTab === NOVA_TAB_TYPE.perplexity) {
        dispatch(setChatMode(SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO));
      } else {
        dispatch(setChatMode(SERVICE_TYPE.NOVA_CHAT_GPT4O));
      }
      dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
    } catch (err) {
      console.log(err);
    }
  };

  return { newChat };
};
