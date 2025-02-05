import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { selectPageStatus } from '../../../store/slices/nova/pageStatusSlice';
import { useAppSelector } from '../../../store/store';
import StepNavigator from '../../stepNavigator';
import Result from '../Result';

import Avatar from './avatar';
import * as S from './style';

export default function AIVideo() {
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));
  const statusToActive = {
    avatar: 0,
    voice: 1,
    script: 2
  } as const;
  const active = statusToActive[status as keyof typeof statusToActive] ?? 0;

  return (
    <StepNavigator
      active={active}
      steps={[
        { label: <S.Label>아바타 선택</S.Label>, children: <Avatar key="avatar" /> },
        { label: <S.Label>목소리 선택</S.Label>, children: <div key="voice">voice</div> },
        { label: <S.Label>스크립트 추가</S.Label>, children: <Result /> }
      ]}
    />
  );
}
