import { apiWrapper } from 'api/apiWrapper';
import { NOVA_DELETE_CONVERSATION, PROMOTION_USER_INFO } from 'api/constant';
import { initNovaHistory, novaHistorySelector } from 'store/slices/nova/novaHistorySlice';
import { setCreating, setUsingAI } from 'store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from 'store/store';

import { IEventType, setPromotionUserInfo } from '../../store/slices/nova/promotionUserInfo';

export const useChatNova = () => {
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const newChat = async () => {
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

      try {
        const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
        const { res } = await apiWrapper().request(PROMOTION_USER_INFO, {
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            type: eventType
          }),
          method: 'POST'
        });
        const response = await res.json();
        if (response.success) {
          dispatch(setPromotionUserInfo(response.data.accurePromotionUser));
        }
      } catch (err) {
        /* empty */
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { newChat };
};
