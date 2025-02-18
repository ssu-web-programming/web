import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { selectPageResult } from '../../../../../store/slices/nova/pageStatusSlice';
import { useAppSelector } from '../../../../../store/store';

import * as S from './style';
import { Container, PercentGuide, ProgressBar } from './style';

interface ProgressProps {
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;
}

export default function Progress({ progress, setProgress }: ProgressProps) {
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));

  return (
    <S.Container isCircle={result?.info.selectedAvatar?.avatar_style === 'circle'}>
      <S.PercentGuide>
        <span>{`${progress}% 진행 중`}</span>
        <S.ProgressBar variant="determinate" value={progress} />
      </S.PercentGuide>
    </S.Container>
  );
}
