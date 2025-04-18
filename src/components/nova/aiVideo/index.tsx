import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
import Result from '../result/index';

import AvatarCard from './component/AvatarCard';
import CustomStepper from './component/stepper';
import Avatar from './avatar';
import Loading from './loading';
import Script from './script';
import * as S from './styles';
import Voice from './voice';

export const stepOrder = ['avatar', 'voice', 'script'] as const;
export default function AIVideo() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));
  const activeStep = stepOrder.includes(status as any) ? stepOrder.indexOf(status as any) : 0;
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const { getAvatars } = useGetAvatars();
  const { getVoices } = useGetVoices();
  const { getLanguages } = useGetLanguages();

  const stepLabels = [
    t('Nova.aiVideo.selectAvatar.stepTitle'),
    t('Nova.aiVideo.selectVoice.stepTitle'),
    t('Nova.aiVideo.addScript.stepTitle')
  ];

  const fetchInitialData = async () => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'progress' }));

    if (!result?.info.avatars) {
      await getAvatars('all');
    }
    if (!result?.info.voices) {
      await getVoices('all', 'all');
    }
    if (!result?.info.languages) {
      await getLanguages();
    }
  };

  useEffect(() => {
    fetchInitialData().then(() => {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: status }));
    });
  }, []);

  const renderStepContent = () => {
    if (activeStep === 0) {
      return <Avatar />;
    } else if (activeStep === 1) {
      return <Voice />;
    } else {
      return <Script />;
    }
  };

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
        <S.Container>
          <CustomStepper currentStep={activeStep} steps={stepLabels.map((label) => ({ label }))} />
          {renderStepContent()}
        </S.Container>
      );
    }
  };

  return <S.Container>{renderContent()}</S.Container>;
}

export { AvatarCard };
