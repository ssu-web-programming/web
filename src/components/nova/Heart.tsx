import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import Heart_10credit from '../../img/nova/promotion/heart_10credit.svg';
import Heart_20credit from '../../img/nova/promotion/heart_20credit.svg';
import Heart_30credit from '../../img/nova/promotion/heart_30credit.svg';
import Heart_finish from '../../img/nova/promotion/Heart_finish.svg';

import { flex } from 'style/cssCommon';

const Img = styled.img<{ size: FlattenSimpleInterpolation }>`
  ${flex}
  ${(props) => props.size}
  cursor: pointer;
`;

interface HeartProps {
  progress: number;
  iconWidth: number;
  iconHeight: number;
}

export const Heart = ({ progress, iconWidth, iconHeight }: HeartProps) => {
  let imgSrc = '';
  if (progress >= 0) {
    imgSrc = Heart_10credit;
  } else if (progress > 10) {
    imgSrc = Heart_20credit;
  } else if (progress > 20) {
    imgSrc = Heart_30credit;
  } else {
    imgSrc = Heart_finish;
  }

  const sizeStyle = css`
    width: ${iconWidth}px;
    height: ${iconHeight}px;
  `;

  return <Img src={imgSrc} alt="heart" size={sizeStyle} />;
};
