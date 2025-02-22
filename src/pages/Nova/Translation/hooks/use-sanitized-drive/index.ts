import { getCurrentFile, getDriveFiles, getLocalFiles } from 'store/slices/uploadFiles';
import { useAppSelector } from 'store/store';
import { downloadFiles } from 'util/files';

import { useTranslationContext } from '../../provider/translation-provider';

export default function useSanitizedDrive() {
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);

  const {
    sharedTranslationInfo: { originalFileType }
  } = useTranslationContext();

  const convertFileObject = async () => {
    const results = await downloadFiles(driveFiles);
    return results[0].file;
  };

  const sanitizedOriginFile = async () => {
    const targetFile = await convertFileObject();

    if (originalFileType === 'currentDoc') {
      return {
        originalFileType,
        originalFileName: targetFile.name,
        originFile: ''
      };
    }

    if (originalFileType === 'drive') {
      return {
        originalFileType,
        originalFileName: targetFile.name,
        originFile: driveFiles[0].fileId
      };
    }

    return {
      originalFileType,
      originalFileName: targetFile.name,
      originFile: new Blob([targetFile], { type: targetFile.type })
    };
  };

  return {
    sanitizedOriginFile,
    convertFileObject,
    isDriveActive: localFiles.length > 0 || driveFiles.length > 0
  };
}
