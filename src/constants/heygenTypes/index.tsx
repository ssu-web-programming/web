export interface Avatars {
  avatar_id: string;
  avatar_name: string;
  gender: 'female' | 'male';
  preview_image_url: string;
  preview_video_url: string;
  file?: File;
}
export const InitAvatars: Avatars = {
  avatar_id: '',
  avatar_name: '',
  gender: 'female',
  preview_image_url: '',
  preview_video_url: '',
  file: undefined
};

export interface Voices {
  voice_id: string;
  language: string;
  gender: 'female' | 'male';
  name: string;
  preview_audio: string;
  flag: string;
}
const InitVoices: Voices = {
  voice_id: '',
  language: '',
  gender: 'female',
  name: '',
  preview_audio: '',
  flag: ''
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
  thumbnail_url: string;
  video_url: string;
}

export const InitVideos: Videos = {
  id: '',
  createdAt: '',
  status: EVideoStatus.processing,
  duration: 0,
  thumbnail_url: '',
  video_url: ''
};

export interface AvatarInfo {
  avatar: Avatars;
  voice: Voices;
  video: Videos;
  avatar_type: 'avatar' | 'taking_photo';
  avatar_style: 'circle' | 'normal';
  input_text: string;
  background_color: string; // 16진수 색상 값
}

export const InitAvatarInfo: AvatarInfo = {
  avatar: InitAvatars,
  voice: InitVoices,
  video: InitVideos,
  avatar_type: 'avatar',
  avatar_style: 'circle',
  input_text: '',
  background_color: '#e8ebed'
};
