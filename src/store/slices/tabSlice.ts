import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface TabType {
  active: boolean;
  selectedTabId: string | null;
}

const tabSlice = createSlice({
  name: 'tab',
  initialState: { active: false, selectedTabId: null } as TabType,
  reducers: {
    initTab: (state) => {
      state.active = false;
      state.selectedTabId = null;
    },
    activeTab: (state) => {
      state.active = true;
    },
    inactiveTab: (state) => {
      state.active = false;
    },
    selectTab: (state, action: PayloadAction<string>) => {
      state.selectedTabId = action.payload;
    }
  }
});

export const { initTab, activeTab, inactiveTab, selectTab } = tabSlice.actions;
export const selectTabSlice = (state: RootState) => state.tab;
export default tabSlice.reducer;
