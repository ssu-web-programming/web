import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';

export type IAnnouceInfo = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: boolean;
  content: string;
  isShow?: boolean;
};

export type InitAnnounceInfo = { announcementList: IAnnouceInfo[] };
const initialState: InitAnnounceInfo = { announcementList: [] };

const announceInfoSlice = createSlice({
  name: 'announceInfo',
  initialState,
  reducers: {
    initAnnounceInfo: (state) => {
      state.announcementList = [];
    },
    setAnnounceInfo: (state, action: PayloadAction<IAnnouceInfo[]>) => {
      state.announcementList = action.payload.map((announce) => ({
        ...announce,
        isShow: announce.isShow ?? true
      }));
    },
    resetAnnounceInfo: (state, action: PayloadAction<string>) => {
      state.announcementList = state.announcementList.filter(
        (announce) => announce.id !== action.payload
      );
    }
  }
});

export const { initAnnounceInfo, setAnnounceInfo, resetAnnounceInfo } = announceInfoSlice.actions;

export const announceInfoSelector = (state: RootState): IAnnouceInfo[] =>
  state.announceInfoSlice.announcementList ?? [];

export default announceInfoSlice.reducer;
