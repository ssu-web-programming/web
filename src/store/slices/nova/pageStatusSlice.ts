import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';

export type PageStatus = 'home' | 'loading' | 'done' | 'timeout';

interface PageStatusState {
  [tab: string]: PageStatus;
}

const initialState: PageStatusState = {};

const pageStatusSlice = createSlice({
  name: 'pageStatus',
  initialState,
  reducers: {
    setPageStatus: (state, action: PayloadAction<{ tab: string; status: PageStatus }>) => {
      const { tab, status } = action.payload;
      state[tab] = status;
    },
    resetPageStatus: (state, action: PayloadAction<string>) => {
      const tab = action.payload;
      state[tab] = 'home';
    }
  }
});

export const { setPageStatus, resetPageStatus } = pageStatusSlice.actions;
export const selectPageStatus =
  (tab: string) =>
  (state: RootState): PageStatus => {
    return state.pageStatusSlice[tab] || 'home';
  };
export default pageStatusSlice.reducer;
