import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { selectPageData } from 'store/slices/nova/pageStatusSlice';
import { getDriveFiles, getLocalFiles } from 'store/slices/uploadFiles';
import { useAppSelector } from 'store/store';
import { downloadFiles } from 'util/files';

const useTranslationIntro = () => {
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.translation));

  const convertFileObject = async () => {
    // driveFiles의 경우에는 id를 파일객체로 변환해야함
    if (driveFiles.length) {
      const results = await downloadFiles(driveFiles);
      return results[0].file;
    }

    if (currentFile) {
      return currentFile;
    }

    return localFiles[0];
  };

  const sanitizedOriginFile = async () => {
    const isDriveFiles = driveFiles.length;
    const isCurrentFile = currentFile;
    const isLocalFiles = localFiles[0];

    if (isDriveFiles) {
      return {
        originalFileType: 'drive',
        originalFileName: (await convertFileObject()).name,
        originFile: driveFiles[0].fileId
      };
    }

    if (isCurrentFile) {
      return {
        originalFileType: 'currentDoc',
        originalFileName: (await convertFileObject()).name,
        originFile: ''
      };
    }

    if (isLocalFiles) {
      return {
        originalFileType: 'local',
        originalFileName: (await convertFileObject()).name,
        originFile: new Blob([localFiles[0]], { type: localFiles[0].type })
      };
    }
  };

  return {
    convertFileObject,
    sanitizedOriginFile,
    isTranslateActive: localFiles.length > 0 || driveFiles.length > 0 || !!currentFile
  };
};

export default useTranslationIntro;
