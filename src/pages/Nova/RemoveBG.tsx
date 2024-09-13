import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { apiWrapper } from '../../api/apiWrapper';
import { NOVA_REMOVE_BACKGROUND } from '../../api/constant';
import { Guide } from '../../components/nova/Guide';
import ImageUploader from '../../components/nova/ImageUploader';
import Loading from '../../components/nova/Loading';
import Result from '../../components/nova/Result';
import {
  selectPageData,
  selectPageStatus,
  setPageResult,
  setPageStatus
} from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import { createFormDataFromFiles } from '../../util/files';

export default function RemoveBG() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.removeBG));
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.removeBG));

  const removeBackground = async () => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      const { res } = await apiWrapper().request(NOVA_REMOVE_BACKGROUND, {
        body: formData,
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.removeBG, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'done' }));
      } else {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'timeout' }));
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'timeout' }));
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'home':
        return (
          <Guide>
            <ImageUploader
              guideMsg={t(`Nova.removeBG.Guide.ImgUploader`)}
              handleUploadComplete={removeBackground}
              curTab={NOVA_TAB_TYPE.removeBG}
            />
          </Guide>
        );
      case 'loading':
        return <Loading />;
      case 'done':
        return <Result />;
      case 'timeout':
        return <div>{t('Operation Timed Out')}</div>;
      default:
        return null;
    }
  };

  return renderContent();
}
