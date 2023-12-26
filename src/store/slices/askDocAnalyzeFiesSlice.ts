import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IFile {
  fileId: string;
  fileRevision: number;
  fileName: string;
  size: number;
}

export type IFileStatus =
  | null
  | 'TEXT_DONE'
  | 'ANALYZE_DONE'
  | 'DOCINFO_DONE'
  | 'USECREDIT_REQUIRED'
  | 'AVAILABLE'
  | 'DELETED';

interface IInitialState {
  isLoading: boolean;
  files: IFile[];
  userId: string;
  isSuccsess: boolean;
  fileStatus: IFileStatus;
  maxFileRevision?: number;
  isInitialized: boolean;
}

const initState: IInitialState = {
  isLoading: true,
  files: [],
  userId: '',
  isSuccsess: false,
  fileStatus: null,
  maxFileRevision: 0,
  isInitialized: false
};

const askDocAnalyzeFilesSlice = createSlice({
  name: 'analyzeFiles',
  initialState: initState,
  reducers: {
    initFiles: () => initState,
    setFiles: (state, action: PayloadAction<IInitialState>) => {
      state = { ...action.payload };
      return state;
    },
    setFileStatus: (state, action: PayloadAction<IInitialState>) => {
      state = { ...state, fileStatus: action.payload.fileStatus };
      return state;
    }
  }
});

export const { initFiles, setFiles, setFileStatus } = askDocAnalyzeFilesSlice.actions;
export const filesSelector = (state: RootState) => state.askDocAnalyzeFiesSlice;
export default askDocAnalyzeFilesSlice.reducer;
