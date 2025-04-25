import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import Spinner from '../../../../../img/light/spinner.webp';

import * as S from './style';

interface ProgressProps {
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;
}

export default function Progress({ progress, setProgress }: ProgressProps) {
  const { t } = useTranslation();

  return (
    <S.Container>
      <S.PercentGuide>
        <img src={Spinner} alt="spinner" width={24} height={24} />
        <span>{`${progress}% ${t('Nova.aiVideo.loading.complete')}`}</span>
      </S.PercentGuide>
    </S.Container>
  );
}
