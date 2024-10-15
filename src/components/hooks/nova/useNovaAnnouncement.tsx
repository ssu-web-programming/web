import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_GET_ANNOUNCEMENT } from '../../../api/constant';
import { langCode } from '../../../locale';
import { setAnnounceInfo, tabTypeMap } from '../../../store/slices/nova/announceSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';

const useNovaAnnouncement = () => {
  const dispatch = useDispatch();

  const setAnnouncementInfo = useCallback(
    async (tab: NOVA_TAB_TYPE) => {
      try {
        const { res } = await apiWrapper().request(NOVA_GET_ANNOUNCEMENT, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ type: tabTypeMap[tab], language: langCode })
        });

        const {
          data: { announcementInfos }
        } = await res.json();
        dispatch(
          setAnnounceInfo({
            tab: tab,
            info: { ...announcementInfos, isShow: announcementInfos.status }
          })
        );
      } catch (err) {
        console.error('Failed to set agreement:', err);
      }
    },
    [dispatch]
  );

  return { setAnnouncementInfo };
};

export default useNovaAnnouncement;
