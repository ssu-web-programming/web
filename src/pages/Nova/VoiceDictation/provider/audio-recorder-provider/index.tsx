import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { platformInfoSelector } from 'store/slices/platformInfo';
import { setLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';
import { ClientType } from 'util/bridge';
import { blobToFile, formatCurrentTime, formatDuration } from 'util/getAudioDuration';
import { convertWebmToWavFile } from 'util/getAudioDuration';

import { useVoiceDictationContext } from '../voice-dictation-provider';

interface AudioRecorderContextType {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: (onConfirm?: () => Promise<boolean>) => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  streamRef: React.MutableRefObject<MediaStream | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  audioContextRef: React.MutableRefObject<AudioContext | null>;
  startVisualization: any;
  initializingRecording: () => void;
}

const AudioRecorderContext = createContext<AudioRecorderContextType | null>(null);

interface AudioRecorderProviderProps {
  children: React.ReactNode;
  // onRecordingComplete?: (blob: Blob) => void;
}

interface CustomCanvasRenderingContext2D extends CanvasRenderingContext2D {
  roundRect: (x: number, y: number, w: number, h: number, radius: number) => void;
}

const calculateBarData = (
  frequencyData: Uint8Array,
  width: number,
  barWidth: number,
  gap: number
): number[] => {
  let units = width / (barWidth + gap);
  let step = Math.floor(frequencyData.length / units);

  if (units > frequencyData.length) {
    units = frequencyData.length;
    step = 1;
  }

  const data: number[] = [];
  for (let i = 0; i < units; i++) {
    let sum = 0;
    for (let j = 0; j < step && i * step + j < frequencyData.length; j++) {
      sum += frequencyData[i * step + j];
    }
    data.push(sum / step);
  }
  return data;
};

const draw = (
  data: number[],
  canvas: HTMLCanvasElement,
  barWidth: number,
  gap: number,
  isPaused: boolean
): void => {
  const ctx = canvas.getContext('2d') as CustomCanvasRenderingContext2D;
  if (!ctx) return;

  const baseHeight = 40;
  const amp = canvas.height / 2;

  // background color 색을 width , height만큼 채우는 코드
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, canvas.clientWidth, 0);
  if (isPaused) {
    gradient.addColorStop(0, '#c9cdd2');
  } else {
    gradient.addColorStop(0, '#a56ae9'); // 보라색 계열 시작
    gradient.addColorStop(0.5, '#9057df'); // 중간 톤의 보라
    gradient.addColorStop(1, '#7741d3'); // 밝은 보라
  }

  const totalBars = Math.floor(canvas.clientWidth / (barWidth + gap));

  for (let i = 0; i < totalBars; i++) {
    ctx.fillStyle = gradient;
    const x = i * (barWidth + gap);
    const value = data[i] || 0;
    const dynamicHeight = baseHeight + value / 2;
    const y = amp - dynamicHeight / 2;
    const h = dynamicHeight;

    ctx.beginPath();
    ctx.fillRect(x, y, barWidth, h);
    ctx.fill();
  }
};

export const AudioRecorderProvider: React.FC<AudioRecorderProviderProps> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 호진 FIXME: 아래 로직은 걷어내고 싶음
  const dispatch = useAppDispatch();
  const { setSharedVoiceDictationInfo } = useVoiceDictationContext();
  const { platform } = useAppSelector(platformInfoSelector);

  const handleMoveToReady = async (file: File) => {
    dispatch(setLocalFiles([file]));
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'VOICE_READY'
    }));
  };

  const handleSetAudioDuration = (duration: number) => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      audioDuration: formatDuration(duration),
      currentTime: formatCurrentTime()
    }));
  };

  const onRecordingComplete = async (blob: Blob) => {
    const file =
      platform === ClientType.windows ? await convertWebmToWavFile(blob) : blobToFile(blob);
    handleMoveToReady(file);
  };

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 0.1);
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startVisualization = useCallback((stream: MediaStream) => {
    if (!canvasRef.current || !stream.active) return;

    try {
      audioContextRef.current = new window.AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();

      source.connect(analyser);
      analyserRef.current = analyser;

      const animate = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(frequencyData);

        const data = calculateBarData(frequencyData, canvasRef.current.clientWidth, 2, 5);

        draw(data, canvasRef.current, 2, 5, isPaused);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    } catch (error) {
      console.error('Error starting visualization:', error);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: platform === ClientType.windows ? 'video/webm;codecs=vp8' : 'video/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      const checkAudioDuration = async (blob: Blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function () {
            const arrayBuffer = reader.result as ArrayBuffer;
            const audioContext = new AudioContext();

            audioContext.decodeAudioData(
              arrayBuffer,
              function (buffer) {
                const duration = buffer.duration;
                handleSetAudioDuration(duration);
                resolve(buffer.duration);
              },
              function (error) {
                reject('Audio decoding failed: ' + error);
              }
            );
          };

          reader.onerror = function (error) {
            reject('File reading failed: ' + error);
          };

          reader.readAsArrayBuffer(blob);
        });
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: platform === ClientType.windows ? 'audio/wav' : 'audio/mpeg'
        });

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        await checkAudioDuration(blob);
        onRecordingComplete?.(blob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(1000);
      startVisualization(stream);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      startTimer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [onRecordingComplete, startTimer, startVisualization]);

  const stopRecording = useCallback(
    async (onConfirm?: () => Promise<boolean>) => {
      if (mediaRecorderRef.current && isRecording) {
        pauseRecording();

        const shouldStop = onConfirm ? await onConfirm() : true;

        if (shouldStop) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current = null;

          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          setIsRecording(false);
          setIsPaused(false);
          stopTimer();
          setRecordingTime(0);
        }
      }
    },
    [isRecording, stopTimer]
  );

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      const isPaused = true;
      mediaRecorderRef.current.pause();
      setIsPaused(isPaused);
      stopTimer();

      // 현재 상태의 마지막 프레임을 회색으로 다시 그리기
      if (canvasRef.current && analyserRef.current) {
        const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(frequencyData);
        const data = calculateBarData(frequencyData, canvasRef.current.clientWidth, 2, 5);
        draw(data, canvasRef.current, 2, 5, isPaused);
      }

      // 애니메이션 중지
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'paused' &&
      streamRef.current
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
      startVisualization(streamRef.current);
    }
  }, [startTimer, startVisualization]);

  const initializingRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      setRecordingTime(0);
    }
  };

  return (
    <AudioRecorderContext.Provider
      value={{
        isRecording,
        isPaused,
        recordingTime,
        audioUrl,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        mediaRecorderRef,
        streamRef,
        canvasRef,
        analyserRef,
        audioContextRef,
        startVisualization,
        initializingRecording
      }}>
      {children}
    </AudioRecorderContext.Provider>
  );
};

export const useAudioRecorder = () => {
  const context = useContext(AudioRecorderContext);
  if (!context) {
    throw new Error('useAudioRecorder must be used within an AudioRecorderProvider');
  }
  return context;
};
