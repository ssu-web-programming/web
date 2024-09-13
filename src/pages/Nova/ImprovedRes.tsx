import { useTranslation } from 'react-i18next';

import { Guide } from '../../components/nova/Guide';
import ImageUploader from '../../components/nova/ImageUploader';
import { NOVA_TAB_TYPE } from '../../store/slices/tabSlice';

export default function ImprovedRes() {
  const { t } = useTranslation();

  const improvedResolution = () => {
    // api to do
  };

  return (
    <Guide>
      <ImageUploader
        guideMsg={t(`Nova.removeBG.Guide.ImgUploader`)}
        handleUploadComplete={improvedResolution}
        curTab={NOVA_TAB_TYPE.improvedRes}
      />
    </Guide>
  );
}
