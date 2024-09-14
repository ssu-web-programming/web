import React from 'react';
import { useTranslation } from 'react-i18next';

import { useRemoveBackground } from '../../components/hooks/nova/useRemoveBackground';
import { Guide } from '../../components/nova/Guide';
import ImageUploader from '../../components/nova/ImageUploader';
import Loading from '../../components/nova/Loading';
import Result from '../../components/nova/Result';
import TimeOut from '../../components/nova/TimeOut';
import { selectPageStatus } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';

export default function RemoveBG() {
  const { t } = useTranslation();
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.removeBG));
  const { handleRemoveBackground } = useRemoveBackground();

  const renderContent = () => {
    switch (status) {
      case 'home':
        return (
          <Guide>
            <ImageUploader
              guideMsg={t(`Nova.removeBG.Guide.ImgUploader`)}
              handleUploadComplete={handleRemoveBackground}
              curTab={NOVA_TAB_TYPE.removeBG}
            />
          </Guide>
        );
      case 'loading':
        return <Loading />;
      case 'done':
        return <Result />;
      case 'timeout':
        return <TimeOut />;
      default:
        return null;
    }
  };

  return renderContent();
}
