import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type CREATING_TYPE = 'none' | 'Chating' | 'Write' | 'CreateImage';

export const TAB_ITEM_VAL = {
  WRITE: 'write',
  CHAT: 'chat'
};

interface TabType {
  creating: CREATING_TYPE;
  selectedTabId: string | null;
}

const tabSlice = createSlice({
  name: 'tab',
  initialState: { creating: 'none', selectedTabId: TAB_ITEM_VAL.CHAT } as TabType,
  reducers: {
    initTab: (state) => {
      state.creating = 'none';
      state.selectedTabId = null;
    },
    setCreating: (state, action: PayloadAction<CREATING_TYPE>) => {
      state.creating = action.payload;
    },
    selectTab: (state, action: PayloadAction<string>) => {
      state.selectedTabId = action.payload;
    }
  }
});

export const { initTab, setCreating, selectTab } = tabSlice.actions;
export const selectTabSlice = (state: RootState) => state.tab;
export default tabSlice.reducer;
