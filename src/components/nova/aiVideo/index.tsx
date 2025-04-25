import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import {
  selectPageResult,
  selectPageStatus,
  setPageStatus,
  updatePageResult
} from '../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useGetAvatars } from '../../hooks/nova/use-get-avatars';
import { useGetLanguages } from '../../hooks/nova/use-get-languages';
import { useGetVoices } from '../../hooks/nova/use-get-voices';
import Result from '../result/index';
import TimeOut from '../TimeOut';

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

    try {
      if (!result?.info.avatars) {
        await getAvatars();
      }

      if (!result?.info.voices) {
        await getVoices('all', 'all');
      }

      if (!result?.info.languages) {
        await getLanguages();
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  useEffect(() => {
    fetchInitialData().then(() => {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: status }));
    });
  }, []);

  // 아바타 로드 완료 시 첫 번째 아바타 자동 선택
  useEffect(() => {
    if (
      result?.info?.avatars &&
      result.info.avatars.length > 0 &&
      (!result?.info?.selectedAvatar?.avatar || !result?.info?.selectedAvatar?.avatar?.avatar_id)
    ) {
      dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: {
              ...result?.info,
              selectedAvatar: {
                ...(result?.info?.selectedAvatar || {}),
                avatar: result.info.avatars[0],
                voice: { voice_id: '' },
                input_text: ''
              }
            }
          }
        })
      );
    }
  }, [result?.info?.avatars]);

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
    } else if (status === 'timeout') {
      return <TimeOut />;
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
