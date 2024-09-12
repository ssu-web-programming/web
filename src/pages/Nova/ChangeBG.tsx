import { useTranslation } from 'react-i18next';

import { Guide } from '../../components/nova/Guide';
import ImageUploader from '../../components/nova/ImageUploader';

export default function ChangeBG() {
  const { t } = useTranslation();

  return (
    <Guide>
      <ImageUploader guideMsg={t(`Nova.changeBG.Guide.ImgUploader`)} />
    </Guide>
  );
}
