import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_SET_USER_INFO_AGREEMENT } from '../../../api/constant';
import { setNovaAgreement } from '../../../store/slices/userInfo';

const useNovaAgreement = () => {
  const dispatch = useDispatch();

  const setIsAgreed = useCallback(
    async (agree: boolean) => {
      try {
        // Redux 상태 업데이트
        dispatch(setNovaAgreement(agree));

        // API 호출
        await apiWrapper().request(NOVA_SET_USER_INFO_AGREEMENT, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ agree })
        });
      } catch (err) {
        console.error('Failed to set agreement:', err);
      }
    },
    [dispatch]
  );

  return { setIsAgreed };
};

export default useNovaAgreement;
