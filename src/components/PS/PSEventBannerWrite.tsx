import ShareTechBanner, {
  DetailBtn,
  MainImg,
  MainText,
  ShareBtn,
  SubText
} from './ShareTechBanner';
import styled, { css } from 'styled-components';
import subText_icon from '../../img/PS/text_share1.svg';
import mainText_icon from '../../img/PS/text_get_speaker.svg';
import detailBtn_icon from '../../img/PS/button_detail.svg';
import shareBtn_icon from '../../img/PS/button_share.svg';
import mainImg_icon from '../../img/PS/img_speaker1.svg';
import { selectWriteHistorySlice } from '../../store/slices/writeHistorySlice';
import usePSEvent, { openDetailPage } from '../hooks/usePSEvent';
import { useAppSelector } from '../../store/store';
import { alignItemCenter, flex, grid, justiCenter } from '../../style/cssCommon';

export const BannerWrapper = styled.div`
  width: 320px;
  height: 60px;
  ${flex}
  ${justiCenter}
  ${alignItemCenter}
  overflow: hidden;
`;

export const GridContainer = styled.div`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}
  ${grid}
  
  grid-template-columns: 73px 138px;
  grid-template-rows: 17px 17px;
  gap: 4px;

  width: fit-content;
  height: fit-content;
`;

const PSEventBannerWrite = () => {
  const { history: writeHistory, currentWriteId } = useAppSelector(selectWriteHistorySlice);
  const psEvent = usePSEvent();

  return (
    <ShareTechBanner>
      <BannerWrapper>
        <GridContainer>
          <SubText
            src={subText_icon}
            cssExt={css`
              ${flex}
            `}
          />

          <MainText
            src={mainText_icon}
            cssExt={css`
              ${flex}
            `}
          />
          <DetailBtn
            onClick={openDetailPage}
            src={detailBtn_icon}
            cssExt={css`
              ${flex}
            `}
          />
          <ShareBtn
            onClick={() => {
              psEvent({
                history: writeHistory,
                currentId: currentWriteId || '',
                isWrite: true
              });
            }}
            src={shareBtn_icon}
            cssExt={css`
              ${flex}
            `}
          />
        </GridContainer>
        <MainImg
          src={mainImg_icon}
          cssExt={css`
            right: 0px;
            top: -10px;
            width: 80px;
            height: 80px;
          `}
        />
      </BannerWrapper>
    </ShareTechBanner>
  );
};

export default PSEventBannerWrite;
