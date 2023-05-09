import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface TabType {
  isLoading: boolean;
  selectedTabId: string | null;
}

const tabSlice = createSlice({
  name: 'tab',
  initialState: { isLoading: false, selectedTabId: null } as TabType,
  reducers: {
    initTab: (state) => {
      state.isLoading = false;
      state.selectedTabId = null;
    },
    setLoadingTab: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    selectTab: (state, action: PayloadAction<string>) => {
      state.selectedTabId = action.payload;
    }
  }
});

export const { initTab, setLoadingTab, selectTab } = tabSlice.actions;
export const selectTabSlice = (state: RootState) => state.tab;
export default tabSlice.reducer;
