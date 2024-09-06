import { NovaChatType } from '../store/slices/novaHistorySlice';

export type SupportFileType = {
  mimeType: string;
  extensions: string;
};

export const SUPPORT_DOCUMENT_TYPE: SupportFileType[] = [
  {
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extensions: '.docx'
  },
  {
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extensions: '.pptx'
  },
  {
    mimeType: 'application/vnd.ms-excel',
    extensions: '.xls'
  },
  {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: '.xlsx'
  },
  {
    mimeType: 'application/x-hwp',
    extensions: '.hwp'
  },
  {
    mimeType: 'application/vnd.hancom.hwp',
    extensions: '.hwp'
  },
  {
    mimeType: 'application/pdf',
    extensions: '.pdf'
  }
];

export const SUPPORT_IMAGE_TYPE: SupportFileType[] = [
  {
    mimeType: 'image/jpeg',
    extensions: '.jpg'
  },
  {
    mimeType: 'image/jpeg',
    extensions: '.jpeg'
  },
  {
    mimeType: 'image/png',
    extensions: '.png'
  },
  {
    mimeType: 'image/gif',
    extensions: '.gif'
  }
];

export const MAX_FILE_UPLOAD_SIZE_MB = 20;
export const MIN_FILE_UPLOAD_SIZE_KB = 1;
export const isValidFileSize = (size: number) => {
  return size < MAX_FILE_UPLOAD_SIZE_MB * 1024 * 1024 && size > MIN_FILE_UPLOAD_SIZE_KB * 1024;
};

export interface FileUpladState extends Pick<NovaChatType, 'type'> {
  state: 'ready' | 'upload' | 'wait' | 'delay';
  progress: number;
}
