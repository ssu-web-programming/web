import React from 'react';
import Lottie from 'react-lottie-player';
import styled from 'styled-components';

import darkSkeleton from '../../../../../img/dark/nova/aiVideo/skeleton_voice.json';
import lightSkeleton from '../../../../../img/light/nova/aiVideo/skeleton_voice.json';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppSelector } from '../../../../../store/store';

const SkeletonContainer = styled.div`
  width: 100%;
  height: 56px;
  border-radius: 4px;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.gray01};
`;

interface VoiceSkeletonProps {
  count?: number;
}

function VoiceSkeleton({ count = 5 }: VoiceSkeletonProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);

  const skeletonAnimData = isLightMode ? lightSkeleton : darkSkeleton;

  const skeletons = Array.from({ length: count }, (_, index) => (
    <SkeletonContainer key={`voice-skeleton-${index}`}>
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

export default VoiceSkeleton;
