import ImageCreate from '../views/ImageCreate';
import HeaderPageLayout from '../components/layout/HeaderPageLayout';
import { useLocation } from 'react-router';

const TextToImage = () => {
  const location = useLocation();
  return (
    <HeaderPageLayout title="AI Tools" subTitle="Text to Image">
      <ImageCreate key={location.state?.time} contents={location.state?.body} />
    </HeaderPageLayout>
  );
};

export default TextToImage;
