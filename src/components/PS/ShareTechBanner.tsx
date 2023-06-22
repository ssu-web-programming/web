import styled from 'styled-components';
import { alignItemCenter, justiCenter } from '../../style/cssCommon';

const BannerArea = styled.div`
  background-color: #171717;
  color: white;
  width: 100%;
  min-width: 320px;
  min-height: 60px;
  ${alignItemCenter}
  ${justiCenter}
`;

export const SubText = styled.img<{ cssExt?: any }>`
  width: 73px;
  height: 16px;

  ${({ cssExt }) => cssExt && cssExt}
`;

export const MainText = styled.img<{ cssExt?: any }>`
  width: 136px;
  height: 17px;

  ${({ cssExt }) => cssExt && cssExt}
`;

export const DetailBtn = styled.img<{ cssExt?: any }>`
  width: 73px;
  height: 16px;
  &:hover {
    cursor: pointer;
  }

  ${({ cssExt }) => cssExt && cssExt}
`;

export const ShareBtn = styled.img<{ cssExt?: any }>`
  width: 138px;
  height: 17px;
  &:hover {
    cursor: pointer;
  }

  ${({ cssExt }) => cssExt && cssExt}
`;

export const MainImg = styled.img<{ cssExt?: any }>`
  width: 73px;
  height: 16px;

  ${({ cssExt }) => cssExt && cssExt}
`;

const ShareTechBanner = ({ children }: { children?: React.ReactNode }) => {
  return <BannerArea>{children}</BannerArea>;
};

export default ShareTechBanner;
