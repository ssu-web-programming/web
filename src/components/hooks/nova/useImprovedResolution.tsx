import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_IMPROVED_RESOLUTION } from '../../../api/constant';
import {
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { createFormDataFromFiles } from '../../../util/files';

export const useImprovedResolution = () => {
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.improvedRes));

  const handleImprovedResolution = async () => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      const { res } = await apiWrapper().request(NOVA_IMPROVED_RESOLUTION, {
        body: formData,
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.improvedRes, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'done' }));
      } else {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'timeout' }));
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'timeout' }));
    }
  };

  return { handleImprovedResolution };
};
