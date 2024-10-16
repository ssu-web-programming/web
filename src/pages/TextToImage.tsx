import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import styled from 'styled-components';

import Header from '../components/layout/Header';
import { flex, flexColumn, flexGrow, flexShrink } from '../style/cssCommon';
import ImageCreate from '../views/ImageCreate';

const Wrapper = styled.div`
  ${flex};
  ${flexColumn};

  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Body = styled.div`
  ${flex};
  ${flexShrink};
  ${flexGrow};
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
    </Wrapper>
  );
};

export default TextToImage;
