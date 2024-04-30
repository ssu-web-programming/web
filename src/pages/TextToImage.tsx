import ImageCreate from '../views/ImageCreate';
import Header from '../components/layout/Header';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { flex, flexColumn, flexGrow, flexShrink } from '../style/cssCommon';
import AiEventBanner from '../external/AiEvent/AiEventBanner';

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Body = styled.div`
  ${flex}
  ${flexShrink}
  ${flexGrow}
`;

const TextToImage = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Header title={t('AITools')} subTitle={t('TextToImage')}></Header>
      <Body>
        <ImageCreate contents={location.state?.body || ''} />
      </Body>
      <AiEventBanner tab="ai.text_to_image" />
    </Wrapper>
  );
};

export default TextToImage;
