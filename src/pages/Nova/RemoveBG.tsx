import { useTranslation } from 'react-i18next';

import { Guide } from '../../components/nova/Guide';
import ImageUploader from '../../components/nova/ImageUploader';

export default function RemoveBG() {
  const { t } = useTranslation();

  return (
    <Guide>
      <ImageUploader guideMsg={t(`Nova.removeBG.Guide.ImgUploader`)} />
    </Guide>
  );
}
