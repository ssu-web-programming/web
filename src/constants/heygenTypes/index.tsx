export interface Avatars {
  id: string;
  name: string;
  gender: string;
  previewImg: string;
  previewVideo: string;
}

export interface Voices {
  id: string;
  lang: string;
  gender: string;
  name: string;
  previewAudio: string;
}

export enum EVideoStatus {
  processing = 'processing',
  completed = 'completed',
  failed = 'failed',
  pending = 'pending'
}
export interface Videos {
  id: string;
  createdAt: string;
  status: EVideoStatus;
  duration: number;
  thumbnail: string;
  video: string;
}

export interface GenerateAvatarsProps {
  avatarId: string;
  voiceId: string;
  type: 'avatar' | 'taking_photo';
  style: 'circle' | 'normal';
  script: string;
  backgroundColor: string; // 16진수 색상 값
}
