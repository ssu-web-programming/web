import { apiWrapper } from 'api/apiWrapper';
import { NOVA_DELETE_CONVERSATION } from 'api/constant';
import { initNovaHistory, novaHistorySelector } from 'store/slices/novaHistorySlice';
import { setCreating } from 'store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from 'store/store';

export const useChatNova = () => {
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const newCHat = async () => {
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
    } catch (err) {
      console.log(err);
    }
  };

  return { newCHat };
};
