export interface Avatars {
  avatar_id: string;
  avatar_name: string;
  gender: 'female' | 'male';
  preview_image_url: string;
  preview_video_url: string;
  file?: File;
}
const InitAvatars: Avatars = {
  avatar_id: '',
  avatar_name: '',
  gender: 'female',
  preview_image_url: '',
  preview_video_url: '',
  file: undefined
};

export interface Voices {
  voice_id: string;
  language: 'Korea' | 'English' | 'Japanese' | 'Chinese';
  gender: 'female' | 'male';
  name: string;
  preview_audio: string;
}
const InitVoices: Voices = {
  voice_id: '',
  language: 'Korea',
  gender: 'female',
  name: '',
  preview_audio: ''
};

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

export interface AvatarInfo {
  avatar: Avatars;
  voice: Voices;
  avatar_style: 'avatar' | 'taking_photo';
  style: 'circle' | 'normal';
  input_text: string;
  background_color: string; // 16진수 색상 값
}

export const InitAvatarInfo: AvatarInfo = {
  avatar: InitAvatars,
  voice: InitVoices,
  avatar_style: 'avatar',
  style: 'circle',
  input_text: '',
  background_color: ''
};
