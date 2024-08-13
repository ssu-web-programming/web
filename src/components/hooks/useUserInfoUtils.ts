import { novaHistorySelector } from 'store/slices/novaHistorySlice';
import { userInfoSelector } from 'store/slices/userInfo';
import { useAppSelector } from 'store/store';

export default function useUserInfoUtils() {
  const { userInfo } = useAppSelector(userInfoSelector);
  const novaHistory = useAppSelector(novaHistorySelector);

  const getAvailableFileCnt = () => {
    switch (userInfo.ul) {
      case '8':
      case '9':
        return 2;
      case '4':
      case '12':
      case '13':
        return 3;
      default:
        return 1;
    }
  };

  const calcAvailableFileCnt = () => {
    const uploadLimit = getAvailableFileCnt();
    const uploadCnt = novaHistory.reduce((acc, cur) => {
      const len = cur.files?.length;
      if (!!len) return acc + len;
      else return acc;
    }, 0);
    return uploadLimit - uploadCnt;
  };

  return { getAvailableFileCnt, calcAvailableFileCnt };
}
