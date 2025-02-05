import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { RootState } from '../../store';

export interface ResultImage {
  contentType: string;
  data: string;
  link?: string;
  info?: any;
}

export type StepStatus<T extends string> =
  | 'home'
  | 'progress'
  | 'saving'
  | 'loading'
  | 'done'
  | 'timeout'
  | T;

export type PageStatus = {
  [NOVA_TAB_TYPE.home]: StepStatus<''>;
  [NOVA_TAB_TYPE.aiChat]: StepStatus<''>;
  [NOVA_TAB_TYPE.perplexity]: StepStatus<''>;
  [NOVA_TAB_TYPE.convert2DTo3D]: StepStatus<'convert'>;
  [NOVA_TAB_TYPE.removeBG]: StepStatus<''>;
  [NOVA_TAB_TYPE.changeBG]: StepStatus<'prompt'>;
  [NOVA_TAB_TYPE.remakeImg]: StepStatus<''>;
  [NOVA_TAB_TYPE.expandImg]: StepStatus<'expand'>;
  [NOVA_TAB_TYPE.improvedRes]: StepStatus<''>;
  [NOVA_TAB_TYPE.changeStyle]: StepStatus<'theme'>;
  [NOVA_TAB_TYPE.translation]: StepStatus<''>;
  [NOVA_TAB_TYPE.voiceDictation]: StepStatus<''>;
  [NOVA_TAB_TYPE.aiVideo]: StepStatus<'avatar' | 'voice' | 'script'>;
};

export type PageData = File | null;
export type PageResult = ResultImage | null;

export type PageStateType = {
  status: { [K in keyof PageStatus]: PageStatus[K] };
  data: { [K in keyof PageStatus]: PageData };
  result: { [K in keyof PageStatus]: PageResult };
};

const initialPageState: PageStateType = {
  status: Object.keys(NOVA_TAB_TYPE).reduce(
    (acc, key) => ({
      ...acc,
      [key as keyof PageStatus]: 'home'
    }),
    {} as PageStateType['status']
  ),
  data: Object.keys(NOVA_TAB_TYPE).reduce(
    (acc, key) => ({
      ...acc,
      [key as keyof PageStatus]: null
    }),
    {} as PageStateType['data']
  ),
  result: Object.keys(NOVA_TAB_TYPE).reduce(
    (acc, key) => ({
      ...acc,
      [key as keyof PageStatus]: null
    }),
    {} as PageStateType['result']
  )
};

const pageSlice = createSlice({
  name: 'page',
  initialState: initialPageState,
  reducers: {
    setPageStatus: <T extends keyof PageStatus>(
      state: PageStateType,
      action: PayloadAction<{ tab: T; status: PageStatus[T] }>
    ) => {
      state.status[action.payload.tab] = action.payload.status;
    },

    resetPageStatus: <T extends keyof PageStatus>(
      state: PageStateType,
      action: PayloadAction<T>
    ) => {
      state.status[action.payload] = 'home';
    },

    setPageData: <T extends keyof PageStatus>(
      state: PageStateType,
      action: PayloadAction<{ tab: T; data: PageData }>
    ) => {
      state.data[action.payload.tab] = action.payload.data;
    },

    resetPageData: <T extends keyof PageStatus>(state: PageStateType, action: PayloadAction<T>) => {
      state.data[action.payload] = null;
    },

    setPageResult: <T extends keyof PageStatus>(
      state: PageStateType,
      action: PayloadAction<{ tab: T; result: PageResult }>
    ) => {
      state.result[action.payload.tab] = action.payload.result;
    },

    resetPageResult: <T extends keyof PageStatus>(
      state: PageStateType,
      action: PayloadAction<T>
    ) => {
      state.result[action.payload] = null;
    }
  }
});

export const {
  setPageStatus,
  resetPageStatus,
  setPageData,
  resetPageData,
  setPageResult,
  resetPageResult
} = pageSlice.actions;

export const selectPageStatus =
  <T extends keyof PageStatus>(tab: T) =>
  (state: RootState): PageStatus[T] =>
    state.pageStatusSlice.status[tab] ?? 'home';

export const selectPageData =
  <T extends keyof PageStatus>(tab: T) =>
  (state: RootState): PageData =>
    state.pageStatusSlice.data[tab] ?? null;

export const selectPageResult =
  <T extends keyof PageStatus>(tab: T) =>
  (state: RootState): PageResult =>
    state.pageStatusSlice.result[tab] ?? null;

export default pageSlice.reducer;
