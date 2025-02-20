import { MediaErrorMessages } from 'types/media-error';

export const VOICE_COLOR = {
  A: '#C6A9FF',
  B: '#A8D98D',
  C: '#FCADAD',
  D: '#8EBFFC',
  E: '#FEC47F',
  F: '#7FA2DC'
};

export const MEDIA_ERROR_MESSAGES: MediaErrorMessages = {
  NotAllowedError: {
    title: '마이크 접근이 거부되었습니다. ',
    msg: '녹음을 시작하려면 오디오 권한을 허용해 주세요!'
  },
  PermissionDeniedError: {
    title: '마이크 접근이 거부되었습니다.',
    msg: '녹음을 시작하려면 오디오 권한을 허용해 주세요!'
  },
  NotFoundError: {
    title: '마이크 장치를 찾을 수 없습니다',
    msg: '현재 사용 가능한 마이크가 감지되지 않았습니다. 정확한 받아쓰기를 위해 마이크를 연결하거나, 장치 설정에서 활성화해 주세요.'
  },
  NotReadableError: {
    title: '접근 권한 중 오류가 발생했습니다.',
    msg: '사용자가 일치하는 장치를 사용할 수 있는 권한을 부여했지만 운영 체제, 브라우저 또는 웹 페이지 수준에서 하드웨어 오류가 발생하여 장치에 액세스할 수 없는 경우 발생합니다.'
  }
};
