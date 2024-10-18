import imageCompression from 'browser-image-compression';

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
        ['.jpg', '.jpeg', '.png', '.webp'].includes(extensions)
      );
    case 'improvedRes':
    case 'changeStyle':
      return SUPPORT_IMAGE_TYPE.filter(({ extensions }) =>
        ['.jpg', '.jpeg', '.png', '.bmp', '.webp'].includes(extensions)
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

export async function compressImage(file: File, tab: NOVA_TAB_TYPE): Promise<File> {
  const convertFile = new File([file], file.name, {
    type: file.type,
    lastModified: file.lastModified
  });
  console.log('conver file: ', convertFile);
  console.log('window.devicePixelRatio: ', window.devicePixelRatio);

  const { width, height } = await getImageDimensions(convertFile);
  console.log('width: ', width);
  console.log('height: ', height);
  let widthOrHeight = -1;

  const megapixels = (width * height) / 1_000_000;
  if (tab === 'removeBG' && megapixels > 25) {
    widthOrHeight = 5000;
  } else if (tab === 'changeBG' && (width > 2048 || height > 2048)) {
    widthOrHeight = 2048;
  } else if (tab === 'remakeImg' && (width > 1024 || height > 1024)) {
    widthOrHeight = 1024;
  } else if (tab === 'expandImg' && megapixels > 10) {
    widthOrHeight = 3000;
  } else if (tab === 'improvedRes' && (width > 2000 || height > 2000)) {
    widthOrHeight = 2000;
  }

  if (widthOrHeight < 0) {
    console.log('no compress: ', convertFile);
    return convertFile;
  } else {
    const options = {
      maxSizeMB: getMaxFileSize(tab),
      useWebWorker: true,
      maxWidthOrHeight: widthOrHeight
    };

    imageCompression(convertFile, options)
      .then(function (compressedFile) {
        return new File([compressedFile], compressedFile.name, {
          type: compressedFile.type,
          lastModified: Date.now()
        });
      })
      .catch(function (error) {
        console.log(error.message);
      });

    return convertFile;
  }
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        img.src = result as string;
      } else {
        reject(new Error('Failed to load image'));
      }
    };

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = (err) => {
      reject(new Error(`Image load error: ${err}`));
    };

    reader.onerror = (err) => {
      reject(new Error(`FileReader error: ${err}`));
    };

    reader.readAsDataURL(file);
  });
}

export const isPixelLimitExceeded = async (file: File, tab: NOVA_TAB_TYPE) => {
  return getImageDimensions(file)
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
