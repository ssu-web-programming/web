// 미디어 접근 에러 타입 정의
export type MediaErrorType =
  | 'NotAllowedError'
  | 'PermissionDeniedError'
  | 'NotFoundError'
  | 'NotReadableError';

// 에러 메시지 타입 정의
export interface MediaErrorMessages {
  [key: string]: MediaErrorContent;
}

export interface MediaErrorContent {
  title: string;
  msg: string;
}

export interface MediaError extends Error {
  name: MediaErrorType;
  message: string;
}
