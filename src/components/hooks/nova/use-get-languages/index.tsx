import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_VOICES_LANG } from '../../../../api/constant';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import { lang } from '../../../../locale';
import { updatePageResult } from '../../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch } from '../../../../store/store';

export function useGetLanguages() {
  const dispatch = useAppDispatch();

  const getLanguages = async () => {
    try {
      const { res } = await apiWrapper().request(`${NOVA_VIDEO_GET_VOICES_LANG}?locale=${lang}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
      });
      const { data } = await res.json();
      if (data.languages.length > 0) {
        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              contentType: '',
              data: '',
              link: '',
              info: {
                languages: data.languages
              }
            }
          })
        );
      }
    } catch (error) {
      console.error('언어 불러오기 실패:', error);
    }
  };

  return { getLanguages };
}
