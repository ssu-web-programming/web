import { css } from 'styled-components';
import ShareTechBanner, {
  DetailBtn,
  MainImg,
  MainText,
  ShareBtn,
  SubText
} from './ShareTechBanner';
import subText_icon from '../../img/PS/text_share2.svg';
import mainText_icon from '../../img/PS/text_get_speaker.svg';
import detailBtn_icon from '../../img/PS/button_detail.svg';
import shareBtn_icon from '../../img/PS/button_share.svg';
import mainImg_icon from '../../img/PS/img_speaker2.svg';
import { useAppSelector } from '../../store/store';
import { selectT2IHistory } from '../../store/slices/txt2imgHistory';
import usePSEvent, { openDetailPage } from '../hooks/usePSEvent';
import { BannerWrapper, GridContainer } from './PSEventBannerWrite';
import { alignItemStart } from '../../style/cssCommon';

const PSEventBannerT2I = () => {
  const { history: imgHistory, currentListId, currentItemIdx } = useAppSelector(selectT2IHistory);
  const psEvent = usePSEvent();

  return (
    <ShareTechBanner>
      <BannerWrapper>
        <MainImg
          src={mainImg_icon}
          cssExt={css`
            width: 116px;
            height: 60px;
            ${alignItemStart}
          `}
        />
        <GridContainer>
          <SubText
            src={subText_icon}
            cssExt={css`
              top: 10px;
              left: 110px;
            `}
          />

          <MainText
            src={mainText_icon}
            cssExt={css`
              top: 10px;
              left: 190px;
            `}
          />
          <DetailBtn
            onClick={openDetailPage}
            src={detailBtn_icon}
            cssExt={css`
              top: 30px;
              left: 110px;
            `}
          />
          <ShareBtn
            onClick={() => {
              psEvent({
                history: imgHistory,
                currentId: currentListId || '',
                currentIndex: currentItemIdx || 0,
                isWrite: false
              });
            }}
            src={shareBtn_icon}
            cssExt={css`
              top: 30px;
              left: 190px;
            `}
          />
        </GridContainer>
      </BannerWrapper>
    </ShareTechBanner>
  );
};

export default PSEventBannerT2I;
