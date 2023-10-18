import ImageCreate from '../views/ImageCreate';
import Header from '../components/layout/Header';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { flex, flexColumn, flexGrow, flexShrink } from '../style/cssCommon';
import PSEventBannerT2I from '../external/PS/PSEventBannerT2I';
import { selectBanner } from '../store/slices/banner';
import { useAppSelector } from '../store/store';
import { selectTabSlice } from '../store/slices/tabSlice';
import { selectT2IHistory } from '../store/slices/txt2imgHistory';

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
  const { active: bannerActive } = useAppSelector(selectBanner);
  const { creating } = useAppSelector(selectTabSlice);
  const { currentListId } = useAppSelector(selectT2IHistory);

  return (
    <Wrapper>
      <Header title={t('AITools')} subTitle="Text to Image"></Header>
      <Body>
        <ImageCreate contents={location.state?.body || ''} />
      </Body>
      {/* {bannerActive && creating !== 'CreateImage' && currentListId && <PSEventBannerT2I />} */}
    </Wrapper>
  );
};

export default TextToImage;
