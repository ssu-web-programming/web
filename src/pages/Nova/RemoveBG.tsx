import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Guide } from '../../components/nova/Guide';
import ImageUploader from '../../components/nova/ImageUploader';
import Loading from '../../components/nova/Loading';
import { selectPageStatus, setPageStatus } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';

export default function RemoveBG() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.removeBG));

  console.log(status);
  const removeBackground = () => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'loading' }));
    // api to do
  };

  const renderContent = () => {
    switch (status) {
      case 'home':
        return (
          <Guide>
            <ImageUploader
              guideMsg={t(`Nova.removeBG.Guide.ImgUploader`)}
              handleUploadComplete={removeBackground}
            />
          </Guide>
        );
      case 'loading':
        return <Loading />;
      case 'done':
        return <div>{t('Upload Complete!')}</div>; // 업로드 완료 후 표시할 컴포넌트
      case 'timeout':
        return <div>{t('Operation Timed Out')}</div>; // 타임아웃 상태를 나타내는 컴포넌트
      default:
        return null;
    }
  };

  return renderContent();
}
