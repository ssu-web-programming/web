import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_INFO, NOVA_VIDEO_MAKE_VIDEOS } from '../../../../api/constant';
import { AvatarInfo, EVideoStatus, InitVideos, Videos } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import {
  resetPageData,
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { activeToast } from '../../../../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import useErrorHandle from '../../../hooks/useErrorHandle';
import AvatarCard from '../component/AvatarCard';
import Progress from '../component/Progress';

import * as S from './style';

const POLLING_INTERVAL = 3000;

export default function Loading() {
  const dispatch = useAppDispatch();
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
    }, 1000);
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
          avatar_type: result?.info.selectedAvatar?.avatar.file ? 'taking_photo' : 'avatar',
          avatar_id: result?.info.selectedAvatar.avatar.avatar_id,
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
      const { res } = await apiWrapper().request(NOVA_VIDEO_GET_INFO, {
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
      }
    } catch (error) {
      errorHandle(error);
      stopTimer();
    }
  };

  return (
    <S.Container>
      <S.Guide>
        <span className="title">비디오 생성 중</span>
        <span className="desc">
          {
            '스크립트양에 따라 다소 시간이 소요될 수 있어요.\n생성 중 화면을 유지하면 영상이\n다운로드 폴더에 자동 저장됩니다.'
          }
        </span>
      </S.Guide>
      <AvatarCard isShowOnlyCard={true}>
        <Progress progress={progress} setProgress={setProgress} />
      </AvatarCard>
    </S.Container>
  );
}
