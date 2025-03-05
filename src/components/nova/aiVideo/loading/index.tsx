import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../../api/apiWrapper';
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
import { useAppDispatch, useAppSelector } from '../../../../store/store';
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
  const [progress, setProgress] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<{ interval: NodeJS.Timeout | null; startTime: number | null }>({
    interval: null,
    startTime: null
  });

  useEffect(() => {
    generateVideo();
  }, []);

  useEffect(() => {
    if (result?.info.selectedAvatar.video.id != '') {
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

  const startTimer = () => {
    if (timerRef.current.interval) return;

    timerRef.current.startTime = Date.now();

    timerRef.current.interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - timerRef.current.startTime!) / 1000);
      const expectedDuration = (result?.info.selectedAvatar.input_text.length || 0) * 60;

      setProgress(Math.floor(Math.min((elapsedSeconds / expectedDuration) * 100, 99)));
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
      startTimer();

      const { res } = await apiWrapper().request(NOVA_VIDEO_MAKE_VIDEOS, {
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
      });

      const { data } = await res.json();

      if (data.video_id) {
        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              info: {
                ...result?.info,
                selectedAvatar: {
                  ...result?.info?.selectedAvatar,
                  video: { ...InitVideos, id: data.video_id }
                }
              }
            }
          })
        );
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
        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_AI_AVATA_VIDEO_HEYGEN);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail
        });
      }
    } catch (error) {
      errorHandle(error);
      stopTimer();
      dispatch(resetPageData(NOVA_TAB_TYPE.aiVideo));
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'home' }));
    }
  };

  return (
    <S.Container>
      <S.Guide>
        <span className="title">{t('Nova.aiVideo.loading.title')}</span>
        <span className="desc">{t('Nova.aiVideo.loading.desc')}</span>
      </S.Guide>
      <AvatarCard isShowOnlyCard={true}>
        <Progress progress={progress} setProgress={setProgress} />
      </AvatarCard>
    </S.Container>
  );
}
