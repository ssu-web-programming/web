import { useState } from 'react';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_AVATARS, NOVA_VIDEO_GET_VOICES } from '../../../../api/constant';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import {
  selectPageResult,
  setPageResult,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

export function useGetVoices() {
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getVoices = async (gender: string, lang: string) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const currentPage = result?.info.voicePage ?? 1;
      const { res } = await apiWrapper().request(
        `${NOVA_VIDEO_GET_VOICES}?page=${currentPage}&limit=10&gender=${gender}&language=${lang}`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        }
      );

      const { data } = await res.json();
      if (data.voices.length > 0) {
        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              info: {
                ...result?.info,
                voicePage: currentPage + 1,
                voices: [...(result?.info?.voices ?? []), ...data.voices]
              }
            }
          })
        );
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('목소리 불러오기 실패:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return { getVoices, hasMore, loading };
}
