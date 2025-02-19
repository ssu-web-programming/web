import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { SERVICE_TYPE } from '../../../constants/serviceType';
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
export type PageService = {
  serviceType: SERVICE_TYPE;
  deductCredit: number;
}[];

export type PageStateType = {
  status: { [K in keyof PageStatus]: PageStatus[K] };
  data: { [K in keyof PageStatus]: PageData };
  result: { [K in keyof PageStatus]: PageResult };
  service: { [K in keyof PageStatus]: PageService };
  isCreditReceived: { [K in keyof PageStatus]: boolean };
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
  ),
  service: Object.keys(NOVA_TAB_TYPE).reduce(
    (acc, key) => ({
      ...acc,
      [key as keyof PageStatus]: []
    }),
    {} as PageStateType['service']
  ),
  isCreditReceived: Object.keys(NOVA_TAB_TYPE).reduce(
    (acc, key) => ({
      ...acc,
      [key as keyof boolean]: false
    }),
    {} as PageStateType['isCreditReceived']
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
    updatePageResult: <T extends keyof PageStatus>(
      state: PageStateType,
      action: PayloadAction<{ tab: T; result: Partial<PageResult> }>
    ) => {
      const safeResult = action.payload.result ?? {};

      state.result[action.payload.tab] = {
        ...(state.result[action.payload.tab] ?? {}),
        contentType: safeResult.contentType ?? state.result[action.payload.tab]?.contentType ?? '',
        data: safeResult.data ?? state.result[action.payload.tab]?.data ?? '',
        link: safeResult.link ?? state.result[action.payload.tab]?.link ?? '',
        info: {
          ...(state.result[action.payload.tab]?.info ?? {}),
          ...safeResult.info
        }
      };
    },
    resetPageResult: <T extends keyof PageStatus>(
      state: PageStateType,
      action: PayloadAction<T>
    ) => {
      state.result[action.payload] = null;
    },
    setPageService: <T extends keyof PageStatus>(
      state: PageStateType,
      action: PayloadAction<{ tab: T; services: PageService }>
    ) => {
      state.service[action.payload.tab] = action.payload.services;
    },
    setPageCreditReceived: <T extends keyof PageStatus>(
      state: PageStateType,
      action: PayloadAction<{ tab: T; isCreditReceived: boolean }>
    ) => {
      state.isCreditReceived[action.payload.tab] = action.payload.isCreditReceived;
    },
    setPageCreditReceivedByServiceType: (
      state: PageStateType,
      action: PayloadAction<{ serviceType: SERVICE_TYPE }>
    ) => {
      const { serviceType } = action.payload;
      const matchedTab = Object.keys(state.service).find((tab) =>
        state.service[tab as keyof PageStatus].some(
          (service) => service.serviceType === serviceType
        )
      ) as keyof PageStatus | undefined;

      if (matchedTab) {
        state.isCreditReceived[matchedTab] = true;
      }
    }
  }
});

export const {
  setPageStatus,
  resetPageStatus,
  setPageData,
  resetPageData,
  setPageResult,
  updatePageResult,
  resetPageResult,
  setPageService,
  setPageCreditReceived,
  setPageCreditReceivedByServiceType
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

export const selectPageService =
  <T extends keyof PageStatus>(tab: T) =>
  (state: RootState): PageService =>
    state.pageStatusSlice.service[tab] ?? null;

export const selectAllServiceCredits = (state: RootState): Record<SERVICE_TYPE, number> => {
  return Object.values(state.pageStatusSlice.service)
    .flat()
    .reduce(
      (acc, service) => {
        acc[service.serviceType] = service.deductCredit;
        return acc;
      },
      {} as Record<SERVICE_TYPE, number>
    );
};

export const selectPageCreditReceived =
  <T extends keyof PageStatus>(tab: T) =>
  (state: RootState): boolean =>
    state.pageStatusSlice.isCreditReceived[tab] ?? false;

export default pageSlice.reducer;
