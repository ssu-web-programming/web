import ImageCreate from '../views/ImageCreate';
import Header from '../components/layout/Header';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { flexColumn } from '../style/cssCommon';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexColumn}
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

const TextToImage = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Header title={t('AITools')} subTitle="Text to Image"></Header>
      <Body>
        <ImageCreate contents={location.state?.body || ''} />
      </Body>
    </Wrapper>
  );
};

export default TextToImage;
