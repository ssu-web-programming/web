import imageCompression from 'browser-image-compression';

import { NovaChatType } from '../store/slices/nova/novaHistorySlice';
import { NOVA_TAB_TYPE } from '../store/slices/tabSlice';
import { ClientType, getPlatform } from '../util/bridge';

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
  },
  {
    mimeType: 'image/bmp',
    extensions: '.bmp'
  },
  {
    mimeType: 'image/webp',
    extensions: '.webp'
  }
];

export const getValidExt = (tab: NOVA_TAB_TYPE) => {
  switch (tab) {
    case 'aiChat':
      return SUPPORT_IMAGE_TYPE.filter(({ extensions }) =>
        ['.jpg', '.jpeg', '.png', '.gif'].includes(extensions)
      );
    case 'removeBG':
    case 'changeBG':
    case 'remakeImg':
    case 'expandImg':
      return SUPPORT_IMAGE_TYPE.filter(({ extensions }) =>
        ['.jpg', '.png', '.webp'].includes(extensions)
      );
    case 'improvedRes':
    case 'changeStyle':
      return SUPPORT_IMAGE_TYPE.filter(({ extensions }) =>
        ['.jpg', '.png', '.bmp', '.webp'].includes(extensions)
      );
    default:
      return [];
  }
};

export const MAX_FILE_UPLOAD_SIZE_MB_AI_CHAT = 20;
export const MAX_FILE_UPLOAD_SIZE_MB_REMOVE_BG = 30;
export const MAX_FILE_UPLOAD_SIZE_MB_CHANGE_BG = 20;
export const MAX_FILE_UPLOAD_SIZE_MB_REMAKE_IMG = 30;
export const MAX_FILE_UPLOAD_SIZE_MB_EXPAND_IMG = 30;
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
  const maxFileSize = getMaxFileSize(tab);
  return maxFileSize < 0
    ? true
    : size < getMaxFileSize(tab) * 1024 * 1024 && size > MIN_FILE_UPLOAD_SIZE_KB * 1024;
};

async function getImageDimensions(
  file: File,
  tab: NOVA_TAB_TYPE
): Promise<{ width: number; height: number }> {
  const options = {
    maxSizeMB: getMaxFileSize(tab),
    maxWidthOrHeight: 2048,
    useWebWorker: true
  };

  const setOptimizationOptions = (width: number, height: number) => {
    const megapixels = (width * height) / 1_000_000;

    if (tab === 'removeBG' && megapixels > 25) {
      options.maxWidthOrHeight = 4999;
    } else if (tab === 'changeBG' && (width > 2048 || height > 2048)) {
      options.maxWidthOrHeight = 2047;
    } else if (tab === 'remakeImg' && (width > 1024 || height > 1024)) {
      options.maxWidthOrHeight = 1023;
    } else if (tab === 'expandImg' && megapixels > 10) {
      options.maxWidthOrHeight = 2999;
    } else if (tab === 'improvedRes' && (width > 2000 || height > 2000)) {
      options.maxWidthOrHeight = 1999;
    }
  };

  const imageSize = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      if (getPlatform() === ClientType.ios) {
        setOptimizationOptions(width, height);

        imageCompression(file, options)
          .then((compressedFile) => {
            const compressedImg = new Image();
            const compressedReader = new FileReader();

            compressedReader.onload = (e) => {
              if (e.target?.result) {
                compressedImg.src = e.target.result as string;
              }
            };

            compressedImg.onload = () => {
              resolve({ width: compressedImg.width, height: compressedImg.height });
            };

            compressedImg.onerror = (err) => {
              reject(err);
            };

            compressedReader.onerror = (err) => {
              reject(err);
            };

            compressedReader.readAsDataURL(compressedFile);
          })
          .catch((error) => {
            console.log('Image compression failed:', error);
            resolve({ width, height });
          });
      } else {
        resolve({ width, height });
      }
    };

    img.onerror = (err) => {
      reject(err);
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });

  return imageSize;
}

export const isPixelLimitExceeded = async (file: File, tab: NOVA_TAB_TYPE) => {
  return getImageDimensions(file, tab)
    .then(async (dimensions) => {
      const { width, height } = dimensions;
      const megapixels = (width * height) / 1000000;

      return (
        (tab === 'removeBG' && megapixels > 25) ||
        (tab === 'changeBG' && (width > 2048 || height > 2048)) ||
        (tab === 'remakeImg' && (width > 1024 || height > 1024)) ||
        (tab === 'expandImg' && megapixels > 10) ||
        (tab === 'improvedRes' && (width > 2000 || height > 2000))
      );
    })
    .catch((err) => {
      console.error('이미지 정보를 가져오는 데 실패했습니다:', err);
      return false;
    });
};

export interface FileUpladState extends Pick<NovaChatType, 'type'> {
  state: 'ready' | 'upload' | 'wait' | 'delay';
  progress: number;
}
