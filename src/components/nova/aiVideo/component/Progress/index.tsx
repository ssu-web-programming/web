import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import * as S from './style';
import { Container, PercentGuide, ProgressBar } from './style';

interface ProgressProps {
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;
}

export default function Progress({ progress, setProgress }: ProgressProps) {
  return (
    <S.Container>
      <S.PercentGuide>
        <span>{`${progress}% 진행 중`}</span>
        <S.ProgressBar variant="determinate" value={progress} />
      </S.PercentGuide>
    </S.Container>
  );
}
