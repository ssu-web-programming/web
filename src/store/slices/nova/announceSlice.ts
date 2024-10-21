import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { NOVA_TAB_TYPE } from '../tabSlice';

export const tabTypeMap = {
  [NOVA_TAB_TYPE.aiChat]: 'NOVA_CHAT_GPT4O',
  [NOVA_TAB_TYPE.removeBG]: 'NOVA_REMOVE_BG',
  [NOVA_TAB_TYPE.changeBG]: 'NOVA_REPLACE_BG_CLIPDROP',
  [NOVA_TAB_TYPE.remakeImg]: 'NOVA_REIMAGE_CLIPDROP',
  [NOVA_TAB_TYPE.expandImg]: 'NOVA_UNCROP_CLIPDROP',
  [NOVA_TAB_TYPE.improvedRes]: 'NOVA_PO_RESOLUTION',
  [NOVA_TAB_TYPE.changeStyle]: 'NOVA_PO_STYLE_TRANSFER'
} as const;

export type IAnnouceInfo = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: boolean;
  content: string;
};

export type AnnounceState = Record<string, IAnnouceInfo>;

const initialAnnounceInfo: IAnnouceInfo = {
  id: '',
  type: '',
  startDate: '',
  endDate: '',
  status: false,
  content: ''
};

const initialState: AnnounceState = {};

const announceInfoSlice = createSlice({
  name: 'announceInfo',
  initialState,
  reducers: {
    initAnnounceInfo: (state, action: PayloadAction<string>) => {
      const tab = action.payload;
      state[tab] = { ...initialAnnounceInfo };
    },
    setAnnounceInfo: (state, action: PayloadAction<{ tab: string; info: IAnnouceInfo }>) => {
      const { tab, info } = action.payload;
      state[tab] = { ...info };
    },
    resetAnnounceInfo: (state, action: PayloadAction<string>) => {
      const tab = action.payload;
      delete state[tab];
    }
  }
});

export const { initAnnounceInfo, setAnnounceInfo, resetAnnounceInfo } = announceInfoSlice.actions;

export const announceInfoSelector =
  (tab: string) =>
  (state: RootState): IAnnouceInfo =>
    state.announceInfoSlice[tab] || initialAnnounceInfo;

export default announceInfoSlice.reducer;
