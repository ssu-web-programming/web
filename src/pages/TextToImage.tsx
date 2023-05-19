import ImageCreate from '../views/ImageCreate';
import HeaderPageLayout from '../components/layout/HeaderPageLayout';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

const TextToImage = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <HeaderPageLayout title={t('AITools')} subTitle="Text to Image">
      <ImageCreate key={location.state?.time} contents={location.state?.body} />
    </HeaderPageLayout>
  );
};

export default TextToImage;
