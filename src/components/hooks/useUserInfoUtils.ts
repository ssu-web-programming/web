import { userInfoSelector } from 'store/slices/userInfo';
import { useAppSelector } from 'store/store';

export default function useUserInfoUtils() {
  const { userInfo } = useAppSelector(userInfoSelector);

  const getUploadFileLimit = () => {
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

  return { getUploadFileLimit };
}
