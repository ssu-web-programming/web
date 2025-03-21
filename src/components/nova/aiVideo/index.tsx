import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import Progress from '../Progress';
import Result from '../result/index';

import AvatarCard from './component/AvatarCard';
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
        <>
          <StepNavigator
            activeStep={activeStep}
            steps={[
              {
                label: <S.Label>{t('Nova.aiVideo.selectAvatar.stepTitle')}</S.Label>,
                children: <Avatar />
              },
              {
                label: <S.Label>{t('Nova.aiVideo.selectVoice.stepTitle')}</S.Label>,
                children: <Voice />
              },
              {
                label: <S.Label>{t('Nova.aiVideo.addScript.stepTitle')}</S.Label>,
                children: <Script />
              }
            ]}
          />
        </>
      );
    }
  };

  return <S.Container>{renderContent()}</S.Container>;
}
