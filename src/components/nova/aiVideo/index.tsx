import * as React from 'react';
import { useEffect, useState } from 'react';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_VIDEO_GET_AVATARS, NOVA_VIDEO_GET_VOICES } from '../../../api/constant';
import { AvatarInfo, Avatars, Videos, Voices } from '../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { selectPageStatus, setPageStatus } from '../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import StepNavigator from '../../stepNavigator';
import Result from '../result/index';

import AvatarCard from './component/AvatarCard';
import Avatar from './avatar';
import Loading from './loading';
import Script from './script';
import * as S from './styles';
import Voice from './voice';

export default function AIVideo() {
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    const stepMap: Record<string, number> = {
      avatar: 0,
      voice: 1,
      script: 2
    };
    if (status in stepMap) {
      setActiveStep(stepMap[status]);
    }
  }, [status]);

  const renderContent = () => {
    if (status === 'done' || status === 'saving') {
      return (
        <Result>
          <AvatarCard />
        </Result>
      );
    } else if (status === 'loading') {
      return <Loading />;
    } else {
      return (
        <StepNavigator
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          steps={[
            {
              label: <S.Label>아바타 선택</S.Label>,
              children: <Avatar activeStep={activeStep} setActiveStep={setActiveStep} />
            },
            {
              label: <S.Label>목소리 선택</S.Label>,
              children: <Voice activeStep={activeStep} setActiveStep={setActiveStep} />
            },
            {
              label: <S.Label>스크립트 추가</S.Label>,
              children: <Script />
            }
          ]}
        />
      );
    }
  };

  return <>{renderContent()}</>;
}
