import ImageCreate from '../views/ImageCreate';
import HeaderPageLayout from '../components/layout/HeaderPageLayout';

const TextToImage = () => {
  return (
    <HeaderPageLayout title="AI Tools" subTitle="Text to Image">
      <ImageCreate />
    </HeaderPageLayout>
  );
};

export default TextToImage;
