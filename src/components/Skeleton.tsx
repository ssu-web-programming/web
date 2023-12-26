import styled, { keyframes, css } from "styled-components";
import React, { useMemo } from "react";

interface Props {
  width?: number;
  height?: number;
  circle?: boolean;
  $rounded?: boolean;
  count?: number;
  $wUnit?: string;
  $hUnit?: string;
  $animation?: boolean;
  color?: string;
  style?: React.CSSProperties;
  $mb?: number;
}

const Skeleton: React.FC<Props> = ({
  width,
  style,
  height,
  circle,
  $rounded,
  count,
  $hUnit = "px",
  $wUnit = "px",
  $animation = true,
  color = "#f4f4f4",
  $mb = 0
}) => {
  const content = useMemo(() => [...Array({ length: count })].map(() => "-").join(""), [count]);
  return (
    <Base
      style={style}
      $rounded={$rounded}
      circle={circle}
      width={width}
      height={height}
      $animation={$animation}
      $hUnit={$hUnit}
      $wUnit={$wUnit}
      color={color}
      $mb={$mb}
      data-testid="skeleton">
      <Content>{content}</Content>
    </Base>
  );
};

export default Skeleton;

const pulseKeyframe = keyframes`
  0% {
    opacity:1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

const pulseAnimation = css`
  animation: ${pulseKeyframe} 1.5s ease-in-out infinite;
`;

const Base = styled.span<Props>`
  ${({ color }) => color && `background-color: ${color}`};
  ${({ $rounded }) => $rounded && `border-radius: 8px`};
  ${({ circle }) => circle && `border-radius: 50%`};
  ${({ width, height }) => (width || height) && `display: block`};
  ${({ $animation }) => $animation && pulseAnimation};
  margin-bottom: ${({ $mb }) => $mb}px;
  width: ${({ width, $wUnit }) => width && $wUnit && `${width}${$wUnit}`};
  height: ${({ height, $hUnit }) => height && $hUnit && `${height}${$hUnit}`};
`;

const Content = styled.span`
  opacity: 0;
`;
