import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';

import { track } from '@amplitude/analytics-browser';

import { apiWrapper, sendNovaStatus } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_INFO, NOVA_VIDEO_MAKE_VIDEOS } from '../../../../api/constant';
import { EVideoStatus, InitVideos } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import { getServiceLoggingInfo, SERVICE_TYPE } from '../../../../constants/serviceType';
import {
  resetPageData,
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { activeToast } from '../../../../store/slices/toastSlice';
import { getCurrentFile } from '../../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Bridge from '../../../../util/bridge';
import { calLeftCredit } from '../../../../util/common';
import useErrorHandle from '../../../hooks/useErrorHandle';
import AvatarCard from '../component/AvatarCard';
import Progress from '../component/Progress';

import * as S from './style';

const POLLING_INTERVAL = 8000;

export default function Loading() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const errorHandle = useErrorHandle();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const currentFile = useAppSelector(getCurrentFile);
  const [progress, setProgress] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<{ interval: NodeJS.Timeout | null; startTime: number | null }>({
    interval: null,
    startTime: null
  });

  useEffect(() => {
    if (result?.info.selectedAvatar.video.id === '') {
      generateVideo();
    }
  }, []);

  useEffect(() => {
    if (result?.info.selectedAvatar.startTime) {
      const newProgress = calculateProgress(
        result.info.selectedAvatar.startTime,
        result.info.selectedAvatar.input_text
      );
      setProgress(newProgress);
    }
  }, [result?.info.selectedAvatar.startTime]);

  useEffect(() => {
    if (!result?.info.selectedAvatar) return;

    if (result?.info.selectedAvatar.startTime && !timerRef.current.interval) {
      startTimer(result.info.selectedAvatar.startTime);
    }
  }, [result?.info.selectedAvatar.startTime]);

  useEffect(() => {
    if (result?.info.selectedAvatar.video.id) {
      pollingRef.current = setInterval(
        () => pollingVideo(result?.info.selectedAvatar.video.id),
        POLLING_INTERVAL
      );
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [result?.info.selectedAvatar.video.id]);

  // dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'script' }));
  const startTimer = (savedStartTime?: number) => {
    if (timerRef.current.interval) return;

    const startTime = savedStartTime ?? Date.now();
    timerRef.current.startTime = startTime;

    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            ...result?.info,
            selectedAvatar: {
              ...result?.info?.selectedAvatar,
              startTime: startTime
            }
          }
        }
      })
    );

    timerRef.current.interval = setInterval(() => {
      const newProgress = calculateProgress(startTime, result?.info?.selectedAvatar?.input_text);
      setProgress(newProgress);
    }, POLLING_INTERVAL);
  };

  const stopTimer = () => {
    if (timerRef.current.interval) {
      clearInterval(timerRef.current.interval);
      timerRef.current.interval = null;
    }
  };

  const generateVideo = async () => {
    try {
      if (!result?.info.selectedAvatar.startTime) {
        startTimer();
      }

      const { res } = await apiWrapper().request(
        NOVA_VIDEO_MAKE_VIDEOS,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            avatar_type: result?.info.selectedAvatar?.avatar.talking_photo_id
              ? 'talking_photo'
              : 'avatar',
            avatar_id:
              result?.info.selectedAvatar.avatar.avatar_id === ''
                ? result?.info.selectedAvatar.avatar.talking_photo_id
                : result?.info.selectedAvatar.avatar.avatar_id,
            avatar_style: result?.info.selectedAvatar.avatar_style,
            voice_id: result?.info.selectedAvatar.voice.voice_id,
            input_text: result?.info.selectedAvatar.input_text,
            background_color: result?.info.selectedAvatar.background_color
          })
        },
        { name: NOVA_TAB_TYPE.aiVideo, uuid: v4() }
      );

      const response = await res.json();

      if (response.success) {
        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              info: {
                ...result?.info,
                selectedAvatar: {
                  ...result?.info?.selectedAvatar,
                  video: { ...InitVideos, id: response.data.video_id },
                  startTime: Date.now()
                }
              }
            }
          })
        );
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        errorHandle({ code: response.error.code, credit: leftCredit });
        stopTimer();
        dispatch(resetPageData(NOVA_TAB_TYPE.aiVideo));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'home' }));
      }
    } catch (error) {
      errorHandle(error);
      stopTimer();
      dispatch(resetPageData(NOVA_TAB_TYPE.aiVideo));
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'home' }));
    }
  };

  const pollingVideo = async (videoId: string) => {
    try {
      const { res, logger } = await apiWrapper().request(NOVA_VIDEO_GET_INFO, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ video_id: videoId })
      });

      const { data } = await res.json();
      if (data.status === EVideoStatus.completed) {
        stopTimer();
        setProgress(100);

        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              link: data.video_url,
              info: {
                ...result?.info,
                selectedAvatar: {
                  ...result?.info?.selectedAvatar,
                  video: { data }
                }
              }
            }
          })
        );
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'done' }));
        await OnSave(data.video_url);
        await sendNovaStatus({ name: NOVA_TAB_TYPE.aiVideo, uuid: '' }, 'finish');

        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_AI_AVATA_VIDEO_HEYGEN);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail
        });

        const { deductionCredit } = calLeftCredit(res.headers);
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_create_video',
          props: {
            file_id: currentFile.id,
            document_format: currentFile.ext,
            credit: deductionCredit,
            function_result: true
          }
        });
      }
    } catch (error) {
      errorHandle(error);
      stopTimer();
      dispatch(resetPageData(NOVA_TAB_TYPE.aiVideo));
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'home' }));
      await sendNovaStatus({ name: NOVA_TAB_TYPE.aiVideo, uuid: '' }, 'finish');

      await Bridge.callBridgeApi('amplitudeData', {
        type: 'nova_create_video',
        props: {
          file_id: currentFile.id,
          document_format: currentFile.ext,
          function_result: false
        }
      });
    }
  };

  const OnSave = async (link: string) => {
    if (link) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'saving' }));
      Bridge.callBridgeApi('downloadAnimation', link);
    } else {
      dispatch(activeToast({ type: 'error', msg: 'ToastMsg.SaveFailed' }));
    }
  };

  return (
    <S.Container>
      <S.Guide>
        <span className="title">{t('Nova.aiVideo.loading.title')}</span>
        <span className="desc">{t('Nova.aiVideo.loading.desc')}</span>
      </S.Guide>
      <AvatarCard
        isShowOnlyCard={true}
        image={
          result?.info?.selectedAvatar?.avatar?.preview_image_url ||
          result?.info?.selectedAvatar?.avatar?.talking_photo_url
        }
        name={result?.info?.selectedAvatar?.voice?.name || 'Kim-Professional'}
        country={result?.info?.selectedAvatar?.voice?.language || 'South Korea'}
        gender={result?.info?.selectedAvatar?.voice?.gender || 'Female'}>
        <Progress progress={progress} setProgress={setProgress} />
      </AvatarCard>
    </S.Container>
  );
}

const calculateProgress = (startTime: number | null, inputText: string | undefined) => {
  if (!startTime) return 0;

  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  const expectedDuration = (inputText?.length || 0) * 60;

  return Math.floor(Math.min((elapsedSeconds / expectedDuration) * 100, 99));
};
