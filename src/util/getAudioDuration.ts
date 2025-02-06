export const getAudioDuration = (audioFile: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audioObj = new Audio();
    audioObj.src = URL.createObjectURL(audioFile);

    // 메타데이터가 로드된 후에 duration을 얻을 수 있습니다
    audioObj.addEventListener('loadedmetadata', () => {
      const duration = audioObj.duration;
      URL.revokeObjectURL(audioObj.src); // 메모리 누수 방지
      resolve(duration);
    });

    // 에러 처리
    audioObj.addEventListener('error', (error) => {
      URL.revokeObjectURL(audioObj.src);
      reject(error);
    });
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
