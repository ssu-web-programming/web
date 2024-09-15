import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_REMAKE_IMAGE } from '../../../api/constant';
import {
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { createFormDataFromFiles } from '../../../util/files';

export const useRemakeImage = () => {
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.remakeImg));

  const handleRemakeImage = async () => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      const { res } = await apiWrapper().request(NOVA_REMAKE_IMAGE, {
        body: formData,
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.remakeImg, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'done' }));
      } else {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'timeout' }));
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'timeout' }));
    }
  };

  return { handleRemakeImage };
};
