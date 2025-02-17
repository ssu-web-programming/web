import * as React from 'react';
import { useEffect, useState } from 'react';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_VIDEO_GET_AVATARS, NOVA_VIDEO_GET_VOICES } from '../../../api/constant';
import { AvatarInfo, Avatars, Videos, Voices } from '../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import {
  selectPageResult,
  selectPageStatus,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useGetAvatars } from '../../hooks/nova/use-get-avatars';
import { useGetLanguages } from '../../hooks/nova/use-get-languages';
import { useGetVoices } from '../../hooks/nova/use-get-voices';
import StepNavigator from '../../stepNavigator';
import Result from '../result/index';

import AvatarCard from './component/AvatarCard';
import Avatar from './avatar';
import Loading from './loading';
import Script from './script';
import * as S from './styles';
import Voice from './voice';

export default function AIVideo() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));
  const [activeStep, setActiveStep] = useState<number>(0);
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const { getAvatars } = useGetAvatars();
  const { getVoices } = useGetVoices();
  const { getLanguages } = useGetLanguages();

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

  const fetchInitialData = async () => {
    if (!result?.info.avatars) {
      await getAvatars('all');
    }
    if (!result?.info.voices) {
      await getVoices('all', 'all');
    }
    getLanguages();
  };

  useEffect(() => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'progress' }));
    fetchInitialData().then(() => {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'avatar' }));
    });
  }, []);

  const renderContent = () => {
    if (status === 'done' || status === 'saving') {
      return (
        <Result>
          <AvatarCard isHideColorPicker={true} />
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
              children: <Avatar />
            },
            {
              label: <S.Label>목소리 선택</S.Label>,
              children: <Voice />
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
