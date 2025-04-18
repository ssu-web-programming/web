import React from 'react';
import Lottie from 'react-lottie-player';
import styled from 'styled-components';

import darkSkeleton from '../../../../../img/dark/nova/aiVideo/skeleton_thumbnail_avatar.json';
import lightSkeleton from '../../../../../img/light/nova/aiVideo/skeleton_thumbnail_avatar.json';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppSelector } from '../../../../../store/store';

const SkeletonContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

interface AvatarSkeletonProps {
  count?: number;
}

function AvatarSkeleton({ count = 4 }: AvatarSkeletonProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);

  const skeletonAnimData = isLightMode ? lightSkeleton : darkSkeleton;

  const skeletons = Array.from({ length: count }, (_, index) => (
    <SkeletonContainer key={`skeleton-${index}`}>
      <Lottie
        loop
        animationData={skeletonAnimData}
        play
        style={{ width: '100%', height: '100%' }}
      />
    </SkeletonContainer>
  ));

  return <>{skeletons}</>;
}

export default AvatarSkeleton;
