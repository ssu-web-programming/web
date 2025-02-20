import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { setLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch } from 'store/store';
import { ClientType, getPlatform } from 'util/bridge';
import { blobToFile } from 'util/files';
import { convertWebmToWavFile } from 'util/getAudioDuration';

import { calculateBarData, draw } from '../../components/audio-recorder';
import { useVoiceDictationContext } from '../voice-dictation-provider';

interface AudioRecorderContextType {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioUrl: string | null;
  audioDuration: number | null;
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
}

const AudioRecorderContext = createContext<AudioRecorderContextType | null>(null);

interface AudioRecorderProviderProps {
  children: React.ReactNode;
  // onRecordingComplete?: (blob: Blob) => void;
}

export const AudioRecorderProvider: React.FC<AudioRecorderProviderProps> = ({
  children
  // onRecordingComplete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
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

  const handleMoveToReady = async (file: File) => {
    dispatch(setLocalFiles([file]));
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'VOICE_READY'
    }));
  };

  const onRecordingComplete = async (blob: Blob) => {
    const file =
      getPlatform() === ClientType.windows ? await convertWebmToWavFile(blob) : blobToFile(blob);
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

  const startVisualization = useCallback(
    (stream: MediaStream) => {
      if (!canvasRef.current || !stream.active) return;

      try {
        // 기존 AudioContext가 있다면 닫기
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }

        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 2048;

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
    },
    [isPaused]
  );
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: getPlatform() === ClientType.windows ? 'video/webm;codecs=vp8' : 'video/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: getPlatform() === ClientType.windows ? 'audio/wav' : 'audio/mpeg'
        });

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
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

  const stopRecording = useCallback(
    async (onConfirm?: () => Promise<boolean>) => {
      if (mediaRecorderRef.current && isRecording) {
        pauseRecording();

        const shouldStop = onConfirm ? await onConfirm() : true;

        if (shouldStop) {
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
        }
      }
    },
    [isRecording, stopTimer]
  );

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();

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

  return (
    <AudioRecorderContext.Provider
      value={{
        isRecording,
        isPaused,
        recordingTime,
        audioUrl,
        audioDuration,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        mediaRecorderRef,
        streamRef,
        canvasRef,
        analyserRef,
        audioContextRef,
        startVisualization
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
