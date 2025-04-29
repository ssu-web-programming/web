import { useState } from 'react';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_VOICES } from '../../../../api/constant';
import { Voices } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import { selectPageResult, updatePageResult } from '../../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

export function useGetVoices() {
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));

  const [hasMoreMap, setHasMoreMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [lastFilter, setLastFilter] = useState<{ gender: string; lang: string } | null>(null);

  // 목소리 데이터 중복 제거 함수
  const mergeVoices = (existingVoices: Voices[] = [], newVoices: Voices[] = []): Voices[] => {
    const voiceMap = new Map<string, Voices>();

    // 기존 목소리와 새 목소리를 합쳐서 중복 제거
    [...existingVoices, ...newVoices].forEach((voice: Voices) => {
      voiceMap.set(voice.voice_id, voice);
    });

    return Array.from(voiceMap.values());
  };

  // 목소리 데이터 불러오기
  const getVoices = async (gender: string, lang: string) => {
    const filterKey = `${gender}_${lang}`;

    // 이미 로딩 중이거나 더 이상 데이터가 없으면 중단
    if (loading || hasMoreMap[filterKey] === false) return;

    setLoading(true);

    try {
      // 필터가 변경되었는지 확인 (성별 또는 언어가 다르면 새 필터로 간주)
      const isNewFilter = !lastFilter || lastFilter.gender !== gender || lastFilter.lang !== lang;

      // 새 필터면 페이지를 1로 시작, 아니면 기존 페이지 이어서 로드
      const pageNumber = isNewFilter ? 1 : (result?.info.voicePage?.[filterKey] ?? 1);

      if (isNewFilter) {
        setLastFilter({ gender, lang });

        // 페이지 정보 초기화 (새 필터에 대한 페이지는 1로 설정)
        const updatedVoicePage = { ...(result?.info?.voicePage ?? {}) };
        updatedVoicePage[filterKey] = 1;

        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              info: {
                ...result?.info,
                voicePage: updatedVoicePage
              }
            }
          })
        );
      }

      const { res } = await apiWrapper().request(
        `${NOVA_VIDEO_GET_VOICES}?page=${pageNumber}&limit=10&gender=${gender}&language=${lang}`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        }
      );

      const { data } = await res.json();

      if (data.voices && data.voices.length > 0) {
        const oldVoices = result?.info?.voices ?? [];

        // 새 필터면 현재 필터 조건에 맞지 않는 기존 데이터만 유지
        // 같은 필터면 기존 데이터에 새 데이터 추가
        const updatedVoices = isNewFilter
          ? mergeVoices(
              oldVoices.filter(
                (voice: Voices) =>
                  !(
                    (gender === 'all' || voice.gender.toLowerCase() === gender) &&
                    (lang === 'all' || voice.language?.toLowerCase() === lang?.toLowerCase())
                  )
              ),
              data.voices
            )
          : mergeVoices(oldVoices, data.voices);

        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              info: {
                ...result?.info,
                voicePage: {
                  ...(result?.info?.voicePage ?? {}),
                  [filterKey]: pageNumber + 1
                },
                voices: updatedVoices
              }
            }
          })
        );

        if (data.voices.length < 10) {
          setHasMoreMap((prev) => ({ ...prev, [filterKey]: false }));
        }
      } else {
        setHasMoreMap((prev) => ({ ...prev, [filterKey]: false }));
      }
    } catch (error) {
      console.error('목소리 불러오기 실패:', error);
      setHasMoreMap((prev) => ({ ...prev, [filterKey]: false }));
    } finally {
      setLoading(false);
    }
  };

  return {
    getVoices,
    loading
  };
}
