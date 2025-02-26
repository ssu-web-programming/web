import { useState } from 'react';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_AVATARS, NOVA_VIDEO_GET_VOICES } from '../../../../api/constant';
import { Voices } from '../../../../constants/heygenTypes';
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

  const [hasMoreMap, setHasMoreMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const mergeVoices = (existingVoices: Voices[], newVoices: Voices[]): Voices[] => {
    const voiceMap = new Map(existingVoices.map((voice) => [voice.voice_id, voice]));
    newVoices.forEach((voice) => voiceMap.set(voice.voice_id, voice));
    return Array.from(voiceMap.values());
  };

  const getVoices = async (gender: string, lang: string) => {
    if (loading || hasMoreMap[lang] === false) return;
    setLoading(true);

    try {
      const currentPage = result?.info.voicePage?.[lang] ?? 1;
      const { res } = await apiWrapper().request(
        `${NOVA_VIDEO_GET_VOICES}?page=${currentPage}&limit=10&gender=${gender}&language=${lang}`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        }
      );

      const { data } = await res.json();
      console.log(data);
      if (data.voices.length > 0) {
        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              info: {
                ...result?.info,
                voicePage: {
                  ...(result?.info?.voicePage ?? {}),
                  [lang]: currentPage + 1
                },
                voices: mergeVoices(result?.info?.voices ?? [], data.voices)
              }
            }
          })
        );
      } else {
        setHasMoreMap((prev) => ({ ...prev, [lang]: false }));
      }
    } catch (error) {
      console.error('목소리 불러오기 실패:', error);
      setHasMoreMap((prev) => ({ ...prev, [lang]: false }));
    } finally {
      setLoading(false);
    }
  };

  return { getVoices, hasMore: (lang: string) => hasMoreMap[lang] ?? true, loading };
}
