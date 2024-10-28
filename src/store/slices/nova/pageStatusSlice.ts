import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { DriveFileInfo } from '../uploadFiles';

export interface ResultImage {
  contentType: string;
  data: string;
  link?: string;
  info?: any;
}

export type PageStatus =
  | 'home'
  | 'progress'
  | 'saving'
  | 'loading'
  | 'convert'
  | 'prompt'
  | 'expand'
  | 'theme'
  | 'done'
  | 'timeout';
export type PageData = File | DriveFileInfo | null;
export type PageResult = ResultImage | null;

interface PageState<T> {
  [tab: string]: T;
}

interface PageStateType {
  status: PageState<PageStatus>;
  data: PageState<PageData>;
  result: PageState<PageResult>;
}

const initialPageState: PageStateType = {
  status: {},
  data: {},
  result: {}
};

const pageSlice = createSlice({
  name: 'page',
  initialState: initialPageState,
  reducers: {
    setStatus: (state, action: PayloadAction<{ tab: string; status: PageStatus }>) => {
      const { tab, status } = action.payload;
      state.status[tab] = status;
    },
    resetStatus: (state, action: PayloadAction<string>) => {
      const tab = action.payload;
      state.status[tab] = 'home';
    },
    setData: (state, action: PayloadAction<{ tab: string; data: PageData }>) => {
      const { tab, data } = action.payload;
      state.data[tab] = data;
    },
    resetData: (state, action: PayloadAction<string>) => {
      const tab = action.payload;
      state.data[tab] = null;
    },
    setResult: (state, action: PayloadAction<{ tab: string; result: PageResult }>) => {
      const { tab, result } = action.payload;
      state.result[tab] = result;
    },
    resetResult: (state, action: PayloadAction<string>) => {
      const tab = action.payload;
      state.result[tab] = null;
    }
  }
});

export const {
  setStatus: setPageStatus,
  resetStatus: resetPageStatus,
  setData: setPageData,
  resetData: resetPageData,
  setResult: setPageResult,
  resetResult: resetPageResult
} = pageSlice.actions;

export const selectPageStatus =
  (tab: string) =>
  (state: RootState): PageStatus =>
    state.pageStatusSlice.status[tab] || 'home';

export const selectPageData =
  (tab: string) =>
  (state: RootState): PageData =>
    state.pageStatusSlice.data[tab] || null;

export const selectPageResult =
  (tab: string) =>
  (state: RootState): PageResult =>
    state.pageStatusSlice.result[tab] || null;

export default pageSlice.reducer;
