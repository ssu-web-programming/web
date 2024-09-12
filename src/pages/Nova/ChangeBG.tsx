import { useTranslation } from 'react-i18next';

import { Guide } from '../../components/nova/Guide';
import ImageUploader from '../../components/nova/ImageUploader';

export default function ChangeBG() {
  const { t } = useTranslation();

  const changeBackground = () => {
    // api to do
  };

  return (
    <Guide>
      <ImageUploader
        guideMsg={t(`Nova.changeBG.Guide.ImgUploader`)}
        handleUploadComplete={changeBackground}
      />
    </Guide>
  );
}
