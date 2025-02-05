import { novaHistorySelector } from 'store/slices/nova/novaHistorySlice';
import { userInfoSelector } from 'store/slices/userInfo';
import { useAppSelector } from 'store/store';

import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';

export default function useUserInfoUtils() {
  const { userInfo } = useAppSelector(userInfoSelector);
  const novaHistory = useAppSelector(novaHistorySelector);

  const getMaxFilesPerUpload = (selectedNovaTab: NOVA_TAB_TYPE) => {
    // CLT-4661 이미지를 한 번에 10개 이상 업로드 시 에러 나는 문제로
    // 한번에 첨부 가능한 파일 수를 5개로 제한
    if (selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
      return 5;
    } else {
      return 1;
    }
  };

  const getAvailableFileCnt = (selectedNovaTab: NOVA_TAB_TYPE) => {
    if (selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
      switch (userInfo.ul) {
        case '1':
        case '8':
        case '9':
          return 5;
        case '4':
        case '12':
        case '13':
          return 10;
        case '14':
          return -1;
        default:
          return 1;
      }
    } else {
      return 1;
    }
  };

  const calcAvailableFileCnt = (selectedNovaTab: NOVA_TAB_TYPE) => {
    const uploadLimit = getAvailableFileCnt(selectedNovaTab);
    const uploadCnt = novaHistory.reduce((acc, cur) => {
      const len = cur.files?.length;
      if (len) return acc + len;
      else return acc;
    }, 0);
    return uploadLimit === -1 ? uploadLimit : uploadLimit - uploadCnt;
  };

  return { getMaxFilesPerUpload, getAvailableFileCnt, calcAvailableFileCnt };
}
