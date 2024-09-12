import { novaHistorySelector } from 'store/slices/nova/novaHistorySlice';
import { userInfoSelector } from 'store/slices/userInfo';
import { useAppSelector } from 'store/store';

import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';

export default function useUserInfoUtils() {
  const { userInfo } = useAppSelector(userInfoSelector);
  const novaHistory = useAppSelector(novaHistorySelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const getAvailableFileCnt = () => {
    if (selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
      switch (userInfo.ul) {
        case '8':
        case '9':
          return 2;
        case '4':
        case '12':
        case '13':
          return 3;
        case '14':
          return -1;
        default:
          return 1;
      }
    } else {
      return 1;
    }
  };

  const calcAvailableFileCnt = () => {
    const uploadLimit = getAvailableFileCnt();
    const uploadCnt = novaHistory.reduce((acc, cur) => {
      const len = cur.files?.length;
      if (len) return acc + len;
      else return acc;
    }, 0);
    return uploadLimit === -1 ? uploadLimit : uploadLimit - uploadCnt;
  };

  return { getAvailableFileCnt, calcAvailableFileCnt };
}
