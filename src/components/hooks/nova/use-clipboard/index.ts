import { useEffect, useState } from 'react';
import { useConfirm } from 'components/Confirm';
import { getMaxFileSize, MIN_FILE_UPLOAD_SIZE_KB } from 'constants/fileTypes';
import { useTranslation } from 'react-i18next';
import { selectTabSlice } from 'store/slices/tabSlice';
import { useAppSelector } from 'store/store';
import { v4 as uuidv4 } from 'uuid';

interface PasteImage {
  id: string;
  url: string;
}

interface Props {
  maxFileSize?: number;
  allowTypes?: string[];
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const ALLOWED_IMAGES = ['jpeg', 'jpg', 'png', 'gif'];

export default function useClipboard({
  maxFileSize = 20 * 1024 * 1024,
  allowTypes = ALLOWED_TYPES
}: Props = {}) {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const [pastedImages, setPastedImages] = useState<PasteImage[]>([]);

  // 이미지 유효성 검사
  const validateImage = async (file: File): Promise<boolean> => {
    console.log('file-size', file.size > maxFileSize);

    // 파일 크기 체크
    if (file.size > maxFileSize) {
      console.error('파일 크기는 20MB 이하여야 합니다.');
      await confirm({
        title: '',
        msg: t('Nova.Alert.OverFileUploadSize', {
          max: getMaxFileSize(selectedNovaTab),
          min: MIN_FILE_UPLOAD_SIZE_KB
        })!,
        onOk: {
          text: t('Confirm'),
          callback: () => {}
        }
      });

      return false;
    }

    // 파일 타입 체크
    if (!allowTypes.includes(file.type)) {
      await confirm({
        title: '',
        msg:
          selectedNovaTab === 'aiChat'
            ? t('Nova.Alert.CommonUnsupportFile')
            : t(`Nova.Alert.CommonUnsupportImage`, { support: ALLOWED_IMAGES.join(',') }),
        onOk: {
          text: t('Confirm'),
          callback: () => {
            return;
          }
        }
      });
      return false;
    }

    return true;
  };

  const addImage = (imageUrl: string) => {
    const newImage: PasteImage = {
      id: uuidv4(),
      url: imageUrl
    };

    setPastedImages((prev) => {
      const updated = [...prev, newImage];
      return updated;
    });
  };

  const handleRemoveClipboardFile = (file: PasteImage) => {
    const removeTargetFile = pastedImages.filter((image) => image.id !== file.id);
    setPastedImages(removeTargetFile);
  };

  const handlePaste = async (e: ClipboardEvent) => {
    try {
      if (e.clipboardData) {
        // 1. 클립보드 이벤트에서 직접 읽기
        if (e?.clipboardData?.files?.length > 0) {
          const files = Array.from(e.clipboardData.files);
          const imageFiles = files.filter((file) => file.type.startsWith('image/'));

          // 모든 파일이 유효한지 먼저 확인
          for (const file of imageFiles) {
            if (!(await validateImage(file))) {
              return; // 하나라도 유효하지 않으면 전체 처리 중단
            }
          }

          // 모든 파일이 유효한 경우에만 처리 진행
          for (const file of imageFiles) {
            const imageUrl = URL.createObjectURL(file);
            addImage(imageUrl);
          }

          return;
        }
      }

      // 2. Clipboard API 사용
      const items = await navigator.clipboard.read();
      console.log('items', items);
      //   for (const item of items) {
      //     for (const type of item.types) {
      //       if (type.startsWith('image/')) {
      //         const blob = await item.getType(type);
      //         // if (!validateImage(new File([blob], 'pasted-image', { type }))) continue;
      //         const imageUrl = URL.createObjectURL(blob);
      //         addImage(imageUrl);
      //         // setError('');
      //       }
      //     }
      //   }
    } catch (err) {
      console.error('붙여넣기 실패:', err);
    }
  };

  // 전역 붙여넣기 이벤트 리스너
  const handleGlobalPaste = (e: ClipboardEvent) => {
    handlePaste(e);
  };

  console.log('pastedImages', pastedImages);

  // 컴포넌트 마운트/언마운트 시 이벤트 리스너 관리
  useEffect(() => {
    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, []);

  useEffect(() => {
    return () => {
      pastedImages.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [pastedImages]);

  return { pastedImages, handleRemoveClipboardFile };
}
