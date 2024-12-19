import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';

export interface ResultImage {
  contentType: string;
  data: string;
  link?: string;
  info?: any;
}

export type PageStatus =
  | 'home' // 메인 화면
  | 'progress' // 프로그레스 화면
  | 'saving' // 이미지 저장 중
  | 'loading' // 로딩 중 (이미지 업로드)
  | 'convert' // 2d->3d 이미지 변환
  | 'prompt' // changeBG
  | 'expand' // expandImg
  | 'theme' // changeStyle
  | 'done' // 결과 화면
  | 'timeout'; // 타임 아웃
export type PageData = File | null;
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
