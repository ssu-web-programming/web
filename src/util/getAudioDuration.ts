import i18n from 'i18next';

export const getAudioDuration = async (audioFile: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    // iOS Safari 호환성을 위한 조치
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    console.log('AudioContext', AudioContext);
    const audioContext = new AudioContext();
    console.log('audioContext', audioContext);
    const reader = new FileReader();
    console.log('reader', reader);

    reader.onload = async () => {
      // 명시적 타입 체크 및 방어 코드 추가
      if (!reader.result || !(reader.result instanceof ArrayBuffer)) {
        reject(new Error('Failed to read file as ArrayBuffer'));
        return;
      }

      // iOS Safari 호환성을 위해 try-catch로 감싸고 Promise API 활용
      try {
        // decodeAudioData를 Promise API로 래핑하여 사용
        const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
          audioContext.decodeAudioData(
            reader.result as ArrayBuffer,
            (buffer) => resolve(buffer),
            (error) => reject(new Error(error as any))
          );
        });

        resolve(audioBuffer.duration);
        audioContext.close().catch(console.error);
      } catch (error) {
        console.error('Error during audio processing:', error);
        reject(error);
        audioContext.close().catch(console.error);
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };

    // 명시적으로 ArrayBuffer로 읽기
    reader.readAsArrayBuffer(audioFile);
  });
};

export const getAudioDurationViaAudioElement = (audioFile: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!audioFile) {
      reject(new Error('파일이 제공되지 않았습니다.'));
      return;
    }

    // iOS Safari에서 호환성을 위해 URL.createObjectURL 사용
    const objectUrl = URL.createObjectURL(audioFile);

    // 오디오 요소 생성
    const audio = new Audio();

    // 메타데이터 로드 완료 시 실행
    audio.addEventListener('loadedmetadata', () => {
      // 메모리 누수 방지를 위해 URL 객체 해제
      URL.revokeObjectURL(objectUrl);
      resolve(audio.duration);
    });

    // 오류 발생 시 실행
    audio.addEventListener('error', (event) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('오디오 파일을 로드하는 중 오류가 발생했습니다.'));
    });

    // iOS Safari에서 필요한 설정
    audio.preload = 'metadata';
    audio.src = objectUrl;
    audio.load();
  });
};

export const formatDuration = (seconds: number): string => {
  // 시간, 분, 초 계산
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // 각 단위가 0인 경우는 출력하지 않음
  const hoursStr = hours > 0 ? `${hours}시간 ` : '';
  const minutesStr =
    minutes > 0 ? `${minutes}${i18n.t('Nova.voiceDictation.Status.Minutes')} ` : '';
  const secondsStr =
    remainingSeconds > 0
      ? `${remainingSeconds}${i18n.t('Nova.voiceDictation.Status.Seconds')}`
      : '';

  // 모든 단위가 0인 경우 "0초" 반환
  return hoursStr + minutesStr + secondsStr || `0${i18n.t('Nova.voiceDictation.Status.Minutes')}`;
};

export const formatMilliseconds = (ms: number): string => {
  // 전체 초 계산
  const totalSeconds = Math.floor(ms / 1000);

  // 시, 분, 초 계산
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // 각 단위를 2자리 숫자로 패딩
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  // 1시간 미만이면 mm:ss 형식, 이상이면 hh:mm:ss 형식
  return hours > 0
    ? `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
    : `${paddedMinutes}:${paddedSeconds}`;
};

export const blobToFile = (audioBlob: Blob) => {
  const filename = `recording_${new Date().getTime()}.mp3`;
  return new File([audioBlob], filename, {
    type: 'audio/mpeg',
    lastModified: Date.now()
  });
};

export const windowBlobToFile = (audioBlob: Blob) => {
  const filename = `recording_${new Date().getTime()}.mp3`;
  return new File([audioBlob], filename, {
    type: 'audio/wav',
    lastModified: Date.now()
  });
};

export const changeFileExtension = (filename: string, extension: string) => {
  const baseFileName = filename.substring(0, filename.lastIndexOf('.'));

  return `${baseFileName}.${extension}`;
};

export const getSupportedMimeType = () => {
  const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/webm;codecs=opus'];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || '';
};

export const convertWebmToWavFile = async (webmBlob: Blob): Promise<File> => {
  try {
    // WebM을 AudioBuffer로 변환
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // AudioBuffer를 WAV로 변환
    const wavBuffer = audioBufferToWav(audioBuffer);
    const wavFile = new File([wavBuffer], `audio_${Date.now()}.wav`, {
      type: 'audio/wav',
      lastModified: Date.now()
    });

    return wavFile;
  } catch (error) {
    console.error('Error converting audio to WAV:', error);
    throw error;
  }
};

// WAV 변환을 위한 유틸리티 함수들
const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const blockAlign = (numChannels * bitDepth) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = buffer.length * blockAlign;

  const headerSize = 44;
  const wav = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(wav);

  // WAV 헤더 작성
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // 오디오 데이터 작성
  const offset = 44;
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      const value = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset + i * blockAlign + (channel * bitDepth) / 8, value, true);
    }
  }

  return wav;
};

const writeString = (view: DataView, offset: number, string: string): void => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

export function formatCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // 12시간제로 변환
  const formattedHours = hours % 12 || 12;

  // 분이 한 자리 수일 경우 앞에 0 붙이기
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // AM/PM 구분
  const period =
    hours < 12 ? i18n.t('Nova.voiceDictation.Status.Am') : i18n.t('Nova.voiceDictation.Status.Pm');

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

export function getCurrentDateFormatted() {
  const today = new Date();

  // 연도 가져오기
  const year = today.getFullYear();

  // 월 가져오기 (0부터 시작하므로 1을 더함)
  // padStart로 한 자리 수인 경우 앞에 0을 붙임
  const month = String(today.getMonth() + 1).padStart(2, '0');

  // 일 가져오기
  // padStart로 한 자리 수인 경우 앞에 0을 붙임
  const day = String(today.getDate()).padStart(2, '0');

  // YYYY-MM-DD 형태로 조합
  return `(${year}-${month}-${day})`;
}
