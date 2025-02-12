import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReactComponent as Lang } from 'img/light/nova/voiceDictation/lang.svg';
import { ReactComponent as Pause } from 'img/light/nova/voiceDictation/pause.svg';
import { ReactComponent as Play } from 'img/light/nova/voiceDictation/play.svg';
import { ReactComponent as Stop } from 'img/light/nova/voiceDictation/stop.svg';

import * as S from './style';

interface AudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
  barWidth?: number;
  gap?: number;
  isInitRecording?: boolean;
  onRecordingFinish?: () => void;
  onStopConfirm?: () => void | boolean | Promise<unknown>;
  startCondition?: boolean;
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
  ctx.fillStyle = '#f7f8f9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  if (isPaused) {
    gradient.addColorStop(0, '#c9cdd2');
  } else {
    gradient.addColorStop(0, '#a56ae9'); // 보라색 계열 시작
    gradient.addColorStop(0.5, '#9057df'); // 중간 톤의 보라
    gradient.addColorStop(1, '#7741d3'); // 밝은 보라
  }

  const totalBars = Math.floor(canvas.width / (barWidth + gap));

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

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  barWidth = 2,
  gap = 5,
  isInitRecording = false,
  onRecordingFinish,
  onStopConfirm,
  startCondition
}) => {
  const [isRecording, setIsRecording] = useState(isInitRecording || false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    (intervalRef.current as any) = setInterval(() => {
      // console.log('mediaRecorderRef', mediaRecorderRef);
      // console.log('chunksRef', chunksRef.current);
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
    if (!canvasRef.current) return;

    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    const analyser = audioContextRef.current.createAnalyser();

    source.connect(analyser);
    analyserRef.current = analyser;

    const animate = () => {
      if (!canvasRef.current || !analyserRef.current) return;

      const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(frequencyData);

      const data = calculateBarData(frequencyData, canvasRef.current.width, barWidth, gap);

      draw(data, canvasRef.current, barWidth, gap, isPaused);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      // console.log('startRecording-stream', stream);
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        // console.log('event.data', event.data);

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
                setAudioDuration(buffer.duration);
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
        const blob = new Blob(chunksRef.current, { type: 'audio/mpeg' });
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
      setAudioDuration(null);
      setRecordingTime(0);
      startTimer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [onRecordingComplete, startTimer, startVisualization]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      pauseRecording();
      // stop했을때 confirm 창을 띄워서 확인하는 로직!
      const confirmResult = await onStopConfirm?.();

      if (confirmResult) {
        mediaRecorderRef.current.stop();
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
        onRecordingFinish?.();
      }
    }
  }, [isRecording, stopTimer]);

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
        const data = calculateBarData(frequencyData, canvasRef.current.width, barWidth, gap);
        draw(data, canvasRef.current, barWidth, gap, isPaused);
      }

      // 애니메이션 중지
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      const isPaused = false;
      mediaRecorderRef.current.resume();
      setIsPaused(isPaused);
      startTimer();

      if (canvasRef.current && analyserRef.current) {
        const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(frequencyData);
        const data = calculateBarData(frequencyData, canvasRef.current.width, barWidth, gap);
        draw(data, canvasRef.current, barWidth, gap, isPaused);
      }
    }
  }, [startTimer]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 들어오면 바로 시작한다.
  useEffect(() => {
    if (startCondition) {
      console.log('openTab으로 여기를 다시 오면 다시 시작해버리는거야!', startCondition);

      startRecording();
    }
  }, []);

  return (
    <S.Container>
      <S.CanvasWrapper>
        <S.StatusText $isPaused={isPaused}>
          {isPaused ? `일시정지 중` : '한국어 인식 중'}
        </S.StatusText>

        <S.Canvas ref={canvasRef} />

        <S.DurationText>{formatDuration(recordingTime)}</S.DurationText>
      </S.CanvasWrapper>

      <S.ButtonGroup>
        <Lang />
        {isPaused ? (
          <Play width={64} height={64} onClick={resumeRecording} />
        ) : (
          <Pause width={64} height={64} onClick={pauseRecording} />
        )}
        <Stop onClick={stopRecording} />
      </S.ButtonGroup>
    </S.Container>
  );
};

export default AudioRecorder;
