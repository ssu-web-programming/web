import { useTranslation } from 'react-i18next';

import { Guide } from '../../components/nova/Guide';
import ImageUploader from '../../components/nova/ImageUploader';

export default function RemakeImg() {
  const { t } = useTranslation();

  const remakeImage = () => {
    // api to do
  };

  return (
    <Guide>
      <ImageUploader
        guideMsg={t(`Nova.remakeImg.Guide.ImgUploader`)}
        handleUploadComplete={remakeImage}
      />
    </Guide>
  );
}
