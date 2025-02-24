export const getAudioDuration = async (audioFile: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    // AudioContext 생성 시 타입 에러 없이 사용 가능
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log('audioContext', audioContext);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        resolve(audioBuffer.duration);
        audioContext.close();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(audioFile);
  });
};

export const formatDuration = (seconds: number): string => {
  // 시간, 분, 초 계산
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // 각 단위가 0인 경우는 출력하지 않음
  const hoursStr = hours > 0 ? `${hours}시간 ` : '';
  const minutesStr = minutes > 0 ? `${minutes}분 ` : '';
  const secondsStr = remainingSeconds > 0 ? `${remainingSeconds}초` : '';

  // 모든 단위가 0인 경우 "0초" 반환
  return hoursStr + minutesStr + secondsStr || '0초';
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

  // 오전/오후 구분
  const period = hours < 12 ? '오전' : '오후';

  // 12시간제로 변환
  const formattedHours = hours % 12 || 12;

  // 분이 한 자리 수일 경우 앞에 0 붙이기
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `오늘 ${period} ${formattedHours}:${formattedMinutes}`;
}
