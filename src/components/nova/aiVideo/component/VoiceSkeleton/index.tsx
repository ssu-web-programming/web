import * as S from './style';

interface VoiceSkeletonProps {
  count?: number;
}

function VoiceSkeleton({ count = 5 }: VoiceSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <S.SkeletonContainer key={`voice-skeleton-${index}`}>
      <S.Skeleton>
        <div className="content1" />
        <div className="content2" />
      </S.Skeleton>
    </S.SkeletonContainer>
  ));

  return <>{skeletons}</>;
}

export default VoiceSkeleton;
