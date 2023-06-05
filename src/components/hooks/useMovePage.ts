import { updateDefaultInput } from '../../store/slices/chatHistorySlice';
import { TAB_ITEM_VAL, selectTab } from '../../store/slices/tabSlice';
import { useAppDispatch } from '../../store/store';

export const useMoveChatTab = () => {
  const dispatch = useAppDispatch();

  return (defaultChat?: string) => {
    if (defaultChat) dispatch(updateDefaultInput(defaultChat));
    dispatch(selectTab(TAB_ITEM_VAL.CHAT));
  };
};
