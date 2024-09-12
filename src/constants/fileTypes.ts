import { NovaChatType } from '../store/slices/nova/novaHistorySlice';
import { NOVA_TAB_TYPE } from '../store/slices/tabSlice';

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

export const MAX_FILE_UPLOAD_SIZE_MB_AI_CHAT = 20;
export const MAX_FILE_UPLOAD_SIZE_MB_REMOVE_BG = 30;
export const MAX_FILE_UPLOAD_SIZE_MB_CHANGE_BG = 20;
export const MAX_FILE_UPLOAD_SIZE_MB_REMAKE_IMG = -1;
export const MAX_FILE_UPLOAD_SIZE_MB_EXPAND_IMG = 20;
export const MAX_FILE_UPLOAD_SIZE_MB_IMPROVED_RES = 10;
export const MAX_FILE_UPLOAD_SIZE_MB_CHANGE_STYLE = 10;
export const MIN_FILE_UPLOAD_SIZE_KB = 1;

export const getMaxFileSize = (tab: NOVA_TAB_TYPE): number => {
  switch (tab) {
    case NOVA_TAB_TYPE.aiChat:
      return MAX_FILE_UPLOAD_SIZE_MB_AI_CHAT;
    case NOVA_TAB_TYPE.removeBG:
      return MAX_FILE_UPLOAD_SIZE_MB_REMOVE_BG;
    case NOVA_TAB_TYPE.changeBG:
      return MAX_FILE_UPLOAD_SIZE_MB_CHANGE_BG;
    case NOVA_TAB_TYPE.remakeImg:
      return MAX_FILE_UPLOAD_SIZE_MB_REMAKE_IMG;
    case NOVA_TAB_TYPE.expandImg:
      return MAX_FILE_UPLOAD_SIZE_MB_EXPAND_IMG;
    case NOVA_TAB_TYPE.improvedRes:
      return MAX_FILE_UPLOAD_SIZE_MB_IMPROVED_RES;
    case NOVA_TAB_TYPE.changeStyle:
      return MAX_FILE_UPLOAD_SIZE_MB_CHANGE_STYLE;
    default:
      return MAX_FILE_UPLOAD_SIZE_MB_AI_CHAT;
  }
};
export const isValidFileSize = (size: number, tab: NOVA_TAB_TYPE) => {
  return size < getMaxFileSize(tab) * 1024 * 1024 && size > MIN_FILE_UPLOAD_SIZE_KB * 1024;
};

export interface FileUpladState extends Pick<NovaChatType, 'type'> {
  state: 'ready' | 'upload' | 'wait' | 'delay';
  progress: number;
}
