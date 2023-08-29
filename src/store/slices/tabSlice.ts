import { createSlice, PayloadAction, Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import Bridge from '../../util/bridge';

type CREATING_TYPE = 'none' | 'Chating' | 'Write' | 'CreateImage' | 'AskDoc';
export type AI_WRITE_TAB_TYPE = 'write' | 'chat' | 'test';

interface TabType {
  creating: CREATING_TYPE;
  selectedTabId: AI_WRITE_TAB_TYPE;
}

const tabSlice = createSlice({
  name: 'tab',
  initialState: { creating: 'none', selectedTabId: 'chat' } as TabType,
  reducers: {
    initTab: (state) => {
      state.creating = 'none';
      state.selectedTabId = 'chat';
    },
    setCreating: (state, action: PayloadAction<CREATING_TYPE>) => {
      state.creating = action.payload;
    },
    selectTab: (state, action: PayloadAction<AI_WRITE_TAB_TYPE>) => {
      state.selectedTabId = action.payload;
    }
  }
});

export const { initTab, setCreating, selectTab } = tabSlice.actions;
export const selectTabSlice = (state: RootState) => state.tab;
export default tabSlice.reducer;

export const shareAnswerState: Middleware = () => (next) => (action) => {
  if (action.type === 'tab/setCreating') {
    Bridge.callBridgeApi('shareAnswerState', action.payload);
  }
  return next(action);
};
