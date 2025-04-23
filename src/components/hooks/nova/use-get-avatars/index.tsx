import { useState } from 'react';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_AVATARS } from '../../../../api/constant';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import {
  selectPageResult,
  setPageResult,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

export function useGetAvatars() {
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getAvatars = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const currentPage = result?.info.avatarPage ?? 1;
      const { res } = await apiWrapper().request(
        `${NOVA_VIDEO_GET_AVATARS}?page=${currentPage}&limit=30&gender=all`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        }
      );

      const { data } = await res.json();
      if (data.avatars.length > 0) {
        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              contentType: '',
              data: '',
              link: '',
              info: {
                ...result?.info,
                avatarPage: currentPage + 1,
                avatars: [...(result?.info?.avatars ?? []), ...data.avatars]
              }
            }
          })
        );
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('아바타 불러오기 실패:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return { getAvatars, hasMore, loading };
}
