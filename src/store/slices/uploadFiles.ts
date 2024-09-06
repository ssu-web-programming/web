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
    }
  }
});

export const { setLocalFiles, setDriveFiles } = uploadFilesSlice.actions;

export const getLocalFiles = (state: RootState) => state.uploadFiles.localFiles;
export const getDriveFiles = (state: RootState) => state.uploadFiles.driveFiles;

export const uploadFilesSelector = (state: RootState) => state.uploadFiles;

export default uploadFilesSlice.reducer;
