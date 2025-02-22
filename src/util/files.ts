import { apiWrapper } from '../api/apiWrapper';
import {
  PO_DRIVE_CONVERT,
  PO_DRIVE_CONVERT_DOWNLOAD,
  PO_DRIVE_CONVERT_STATUS,
  PO_DRIVE_DOWNLOAD,
  PO_DRIVE_UPLOAD
} from '../api/constant';
import { SUPPORT_IMAGE_TYPE } from '../constants/fileTypes';
import { DelayDocConverting, DocConvertingError } from '../error/error';
import { NovaFileInfo } from '../store/slices/nova/novaHistorySlice';
import { DriveFileInfo } from '../store/slices/uploadFiles';

import { getFileExtension, getFileName } from './common';

interface PollingType extends NovaFileInfo {
  taskId: string;
}

export type DownloadFileResult = {
  success: boolean;
  file: File;
  data: { fileId: string; fileRevision: number };
};

export const downloadFileAsBlob = async (file: DriveFileInfo): Promise<Blob> => {
  const requester = apiWrapper();

  try {
    const { res } = await requester.request(PO_DRIVE_DOWNLOAD, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId: file.fileId }),
      method: 'POST'
    });
    return await res.blob();
  } catch (err) {
    throw err;
  }
};

export const downloadFiles = async (files: DriveFileInfo[]): Promise<DownloadFileResult[]> => {
  const results: DownloadFileResult[] = [];
  for (const file of files) {
    try {
      const { res } = await apiWrapper().request(PO_DRIVE_DOWNLOAD, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.fileId }),
        method: 'POST'
      });

      const blob = await res.blob();
      results.push({
        success: true,
        file: new File([blob], file.fileName, { type: file.fileType }),
        data: { fileId: file.fileId, fileRevision: file.fileRevision }
      });
    } catch (error) {
      results.push({
        success: false,
        file: new File([], file.fileName, { type: file.fileType }),
        data: { fileId: file.fileId, fileRevision: file.fileRevision }
      });
      throw error;
    }
  }

  return results;
};

export const uploadFiles = async (files: File[]) => {
  const ret = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append('uploadFile', file);

    const { res } = await apiWrapper().request(PO_DRIVE_UPLOAD, {
      body: formData,
      method: 'POST'
    });
    const json = await res.json();
    ret.push({ ...json, file });
  }
  return ret;
};

const reqConvertFile = async (fileInfo: NovaFileInfo) => {
  const { res } = await apiWrapper().request(PO_DRIVE_CONVERT, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fileInfo }),
    method: 'POST'
  });
  const json = await res.json();
  const {
    success,
    data: { taskId }
  } = json;
  if (!success) throw new Error('Convert Error');
  const converted = await downloadConvertFile({ ...fileInfo, taskId });
  return converted;
};

const getConvertStatus = async (fileInfo: { taskId: string }) => {
  try {
    const { res } = await apiWrapper().request(PO_DRIVE_CONVERT_STATUS, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: fileInfo.taskId }),
      method: 'POST'
    });
    const json = await res.json();
    const {
      success,
      data: { status }
    } = json;
    if (!success) throw new Error();
    return status;
  } catch (err) {
    if (err instanceof DelayDocConverting) throw err;
    else throw new DocConvertingError();
  }
};

export const downloadConvertFile = async (fileInfo: PollingType) => {
  const pollingConvertStatus = () =>
    new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const status = await getConvertStatus(fileInfo);
          if (status === 'completed') {
            resolve();
          } else {
            resolve(await pollingConvertStatus());
          }
        } catch (err) {
          reject(err);
        }
      }, 100);
    });
  await pollingConvertStatus();

  const { res } = await apiWrapper().request(PO_DRIVE_CONVERT_DOWNLOAD, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId: fileInfo.fileId, fileRevision: fileInfo.fileRevision }),
    method: 'POST'
  });
  const blob = await res.blob();
  return new File([blob], `${getFileName(fileInfo.name)}.pdf`, { type: 'application/pdf' });
};

export const convertFiles = async (files: NovaFileInfo[]) => {
  const promises = files.map(async (file) => {
    const ext = getFileExtension(file.file.name);
    if (ext === '.hwp' || ext === '.xls' || ext === '.xlsx') {
      const converted = await reqConvertFile(file);
      return { ...file, file: converted };
    } else {
      return file;
    }
  });
  return await Promise.all(promises);
};

export const createFormDataFromFiles = async (
  files: (File | DriveFileInfo)[]
): Promise<FormData> => {
  const formData = new FormData();

  for (const file of files) {
    if (file instanceof File) {
      formData.append('multipartFile', file);
    } else if ('fileId' in file) {
      try {
        const blob = await downloadFileAsBlob(file);
        const fileName = file.name;
        const fileType = file.type;
        formData.append('multipartFile', new File([blob], fileName, { type: fileType }));
      } catch (err) {
        throw err;
      }
    }
  }

  return formData;
};

export const convertDriveFileToFile = async (file: File | DriveFileInfo): Promise<File> => {
  try {
    if ('fileId' in file) {
      const blob = await downloadFileAsBlob(file);
      return new File([blob], file.fileName, { type: file.type });
    }
    return file;
  } catch (error) {
    throw error;
  }
};

export const downloadFileIdToBlob = async (fileId: string): Promise<Blob> => {
  const requester = apiWrapper();

  try {
    const { res } = await requester.request(PO_DRIVE_DOWNLOAD, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
      method: 'POST'
    });
    return await res.blob();
  } catch (err) {
    throw err;
  }
};

export const currentFileToFileObj = async (
  fileId: string,
  fileName: string,
  type: string
): Promise<File> => {
  try {
    const blob = await downloadFileIdToBlob(fileId);
    return new File([blob], fileName, { type });
  } catch (error) {
    throw error;
  }
};

export const fileToBase64 = async (file: File): Promise<{ contentType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        const contentType = result.split(';')[0].split(':')[1];

        resolve({ contentType, data: base64Data });
      } else {
        reject(new Error('Failed to convert file to Base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: mimeType });
};

export const blobToFile = (blob: Blob): File => {
  const fileType = SUPPORT_IMAGE_TYPE.find((type) => type.mimeType === blob.type);
  const ext = fileType ? fileType.extensions : '.png';

  console.log('ext', ext);
  return new File([blob], `image${ext}`, { type: blob.type });
};

export const base64ToFile = (base64: string, mimeType: string): File => {
  const blob = base64ToBlob(base64, mimeType);
  return blobToFile(blob);
};
