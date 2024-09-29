import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

export interface DriveFileInfo {
  fileId: string;
  fileName: string;
  fileRevision: number;
  fileType: 'DIR' | 'FILE';
  lastModified: number;
  size: number;

  name: string;
  type: string;
}

export type CurrentFileType = 'new' | 'drive' | 'local' | 'notSupported' | 'unknown';

export interface CurrentFileInfo {
  type: CurrentFileType;
  id: string;
  size: number;
  ext: string;
  isSaved: boolean;
}

export interface LoadingFileInfo {
  id: string;
}

type UploadFilesState = {
  localFiles: File[];
  driveFiles: DriveFileInfo[];
  currentFile: CurrentFileInfo;
  loadingFile: LoadingFileInfo;
};

const initialState: UploadFilesState = {
  localFiles: [],
  driveFiles: [],
  currentFile: {
    type: 'unknown',
    id: '',
    size: 0,
    ext: '',
    isSaved: false
  },
  loadingFile: {
    id: ''
  }
};

const uploadFilesSlice = createSlice({
  name: 'uploadFiles',
  initialState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<CurrentFileInfo>) => {
      state.currentFile = action.payload;
    },
    setLocalFiles: (state, action: PayloadAction<File[]>) => {
      state.localFiles = action.payload;
    },
    setDriveFiles: (state, action: PayloadAction<DriveFileInfo[]>) => {
      state.driveFiles = action.payload;
    },
    setLoadingFile: (state, action: PayloadAction<LoadingFileInfo>) => {
      state.loadingFile = action.payload;
    },
    removeCurrentFile: (state) => {
      state.currentFile = {
        type: 'unknown',
        id: '',
        size: 0,
        ext: '',
        isSaved: false
      };
    },
    removeLocalFile: (state, action: PayloadAction<File>) => {
      state.localFiles = state.localFiles.filter((file) => file !== action.payload);
    },
    removeDriveFile: (state, action: PayloadAction<DriveFileInfo>) => {
      state.driveFiles = state.driveFiles.filter((file) => file.name !== action.payload.name);
    },
    removeLoadingFile: (state) => {
      state.loadingFile = {
        id: ''
      };
    }
  }
});

export const {
  setCurrentFile,
  setLocalFiles,
  setDriveFiles,
  setLoadingFile,
  removeCurrentFile,
  removeLocalFile,
  removeDriveFile,
  removeLoadingFile
} = uploadFilesSlice.actions;

export const getCurrentFile = (state: RootState) => state.uploadFiles.currentFile;
export const getLocalFiles = (state: RootState) => state.uploadFiles.localFiles;
export const getDriveFiles = (state: RootState) => state.uploadFiles.driveFiles;
export const getLoadingFile = (state: RootState) => state.uploadFiles.loadingFile;

export default uploadFilesSlice.reducer;
