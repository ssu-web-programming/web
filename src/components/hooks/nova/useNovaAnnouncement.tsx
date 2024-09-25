import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_GET_ANNOUNCEMENT } from '../../../api/constant';
import {
  announceInfoSelector,
  setAnnounceInfo,
  tabTypeMap
} from '../../../store/slices/nova/announceSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { useAppSelector } from '../../../store/store';

const useNovaAnnouncement = (tab: NOVA_TAB_TYPE) => {
  const dispatch = useDispatch();
  const announceInfo = useAppSelector(announceInfoSelector(tab));

  const setAnnouncementInfo = useCallback(async () => {
    if (announceInfo.type != '' && !announceInfo.isShow) return;

    try {
      const { res } = await apiWrapper().request(NOVA_GET_ANNOUNCEMENT, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ type: tabTypeMap[tab] })
      });

      const {
        data: { announcementInfos }
      } = await res.json();
      dispatch(setAnnounceInfo({ ...announcementInfos, isShow: announcementInfos.status }));
    } catch (err) {
      console.error('Failed to set agreement:', err);
    }
  }, [dispatch]);

  return { setAnnouncementInfo };
};

export default useNovaAnnouncement;
