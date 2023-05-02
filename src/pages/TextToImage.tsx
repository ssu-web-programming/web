import ImageCreate from '../views/ImageCreate';
import TabPage from '../components/layout/TabLayout';

const tabList = [
  {
    id: 'createImage',
    name: '이미지 생성',
    comp: <ImageCreate />
  }
];

const TextToImage = () => {
  return <TabPage title="AI Tools" subTitle="Text to Image" tabList={tabList} />;
};

export default TextToImage;
