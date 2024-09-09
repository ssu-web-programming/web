import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DriveFileInfo } from '../../components/PoDrive';
import { RootState } from '../store';

type UploadFilesState = {
  localFiles: File[];
  driveFiles: DriveFileInfo[];
};

const initialState: UploadFilesState = {
  localFiles: [],
  driveFiles: []
};

const uploadFilesSlice = createSlice({
  name: 'uploadFiles',
  initialState,
  reducers: {
    setLocalFiles: (state, action: PayloadAction<File[]>) => {
      state.localFiles = action.payload;
    },
    setDriveFiles: (state, action: PayloadAction<DriveFileInfo[]>) => {
      state.driveFiles = action.payload;
    },
    removeLocalFile: (state, action: PayloadAction<File>) => {
      state.localFiles = state.localFiles.filter((file) => file !== action.payload);
    },
    removeDriveFile: (state, action: PayloadAction<DriveFileInfo>) => {
      state.driveFiles = state.driveFiles.filter((file) => file.name !== action.payload.name);
    }
  }
});

export const { setLocalFiles, setDriveFiles, removeLocalFile, removeDriveFile } =
  uploadFilesSlice.actions;

export const getLocalFiles = (state: RootState) => state.uploadFiles.localFiles;
export const getDriveFiles = (state: RootState) => state.uploadFiles.driveFiles;

export const uploadFilesSelector = (state: RootState) => state.uploadFiles;

export default uploadFilesSlice.reducer;
