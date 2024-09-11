import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';

import Bridge from '../../util/bridge';
import { RootState } from '../store';

export type CREATING_TYPE =
  | 'none'
  | 'Chatting'
  | 'Write'
  | 'CreateImage'
  | 'ASKDoc'
  | 'TextExtract'
  | 'CreateVectorData'
  | 'PreAsk'
  | 'MakeSummary'
  | 'AI Apps'
  | 'NOVA';
export type AI_WRITE_TAB_TYPE = 'write' | 'chat';

export enum NOVA_TAB_TYPE {
  aiChat = 'aiChat',
  removeBG = 'removeBG',
  changeBG = 'changeBG',
  remakeImg = 'remakeImg',
  expandImg = 'expandImg',
  improvedRes = 'improvedRes',
  changeStyle = 'changeStyle'
}

interface TabType {
  creating: CREATING_TYPE;
  selectedTabId: AI_WRITE_TAB_TYPE;
  selectedNovaTab: NOVA_TAB_TYPE;
  showChatEOS: boolean;
}

const tabSlice = createSlice({
  name: 'tab',
  initialState: {
    creating: 'none',
    selectedTabId: 'write',
    selectedNovaTab: 'aiChat',
    showChatEOS: false
  } as TabType,
  reducers: {
    initTab: (state) => {
      state.creating = 'none';
      state.selectedTabId = 'chat';
      state.selectedNovaTab = NOVA_TAB_TYPE.aiChat;
    },
    setCreating: (state, action: PayloadAction<CREATING_TYPE>) => {
      state.creating = action.payload;
    },
    selectTab: (state, action: PayloadAction<AI_WRITE_TAB_TYPE>) => {
      state.selectedTabId = action.payload;
    },
    selectNovaTab: (state, action: PayloadAction<NOVA_TAB_TYPE>) => {
      state.selectedNovaTab = action.payload;
    },
    setshowChatEOS: (state) => {
      state.showChatEOS = true;
    }
  }
});

export const { initTab, setCreating, selectTab, selectNovaTab, setshowChatEOS } = tabSlice.actions;
export const selectTabSlice = (state: RootState) => state.tab;
export default tabSlice.reducer;

export const shareAnswerState: Middleware = () => (next) => (action) => {
  if (action.type === 'tab/setCreating') {
    Bridge.callBridgeApi('shareAnswerState', action.payload);
  }
  return next(action);
};
