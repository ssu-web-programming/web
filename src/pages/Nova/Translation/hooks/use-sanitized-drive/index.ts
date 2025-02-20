import { getCurrentFile, getDriveFiles, getLocalFiles } from 'store/slices/uploadFiles';
import { useAppSelector } from 'store/store';
import { currentFileToFileObj, downloadFiles } from 'util/files';

export default function useSanitizedDrive() {
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);
  const currentFile = useAppSelector(getCurrentFile);

  const convertFileObject = async () => {
    if (currentFile.id !== '') {
      const convertFileObj = await currentFileToFileObj(
        currentFile.id,
        currentFile.name!,
        currentFile.type
      );

      return convertFileObj;
    }

    // driveFiles의 경우에는 id를 파일객체로 변환해야함
    if (driveFiles.length) {
      const results = await downloadFiles(driveFiles);
      return results[0].file;
    }

    return localFiles[0];
  };

  const sanitizedOriginFile = async () => {
    const isDriveFiles = driveFiles.length;
    const isCurrentFile = currentFile.id === '' ? false : true;
    const isLocalFiles = localFiles[0];

    console.log('sanitizedOriginFile--currentFile', currentFile);
    console.log('(await convertFileObject()).name', (await convertFileObject()).name);

    if (isCurrentFile) {
      return {
        originalFileType: 'currentDoc',
        originalFileName: (await convertFileObject()).name,
        originFile: ''
      };
    }

    if (isDriveFiles) {
      return {
        originalFileType: 'drive',
        originalFileName: (await convertFileObject()).name,
        originFile: driveFiles[0].fileId
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
    sanitizedOriginFile,
    convertFileObject,
    isDriveActive:
      localFiles.length > 0 ||
      driveFiles.length > 0 ||
      (currentFile.id !== '' && (currentFile.id as any) !== 0 && currentFile.id !== undefined)
  };
}
