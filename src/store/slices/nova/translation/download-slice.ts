import { RootState } from 'store/store';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IFileState {
  type: string;
  isSaved: boolean;
}

const initialState: IFileState = {
  type: '',
  isSaved: false
};

const fileStateSlice = createSlice({
  name: 'fileState',
  initialState,
  reducers: {
    initFileState: () => {
      return { ...initialState };
    },
    setFileState: (state, action: PayloadAction<IFileState>) => {
      return { ...state, ...action.payload };
    },
    resetFileState: () => {
      return { ...initialState };
    },
    // getter 추가
    getFileState: (state) => {
      return state;
    }
  }
});

export const { initFileState, setFileState, resetFileState, getFileState } = fileStateSlice.actions;

export const fileStateSelector = (state: RootState): IFileState => state.fileStateSlice;

export default fileStateSlice.reducer;
