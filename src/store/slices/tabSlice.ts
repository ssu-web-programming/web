import { createSlice, Middleware, PayloadAction } from '@reduxjs/toolkit';

import Bridge from '../../util/bridge';
import { RootState } from '../store';

export type CREATING_TYPE =
  | 'none' // 초기 상태
  | 'Chatting'
  | 'Write'
  | 'CreateImage'
  | 'ASKDoc' // askdoc
  | 'TextExtract' // askdoc text 추출
  | 'CreateVectorData' // askdoc vector 생성
  | 'PreAsk' // askdoc 질의
  | 'MakeSummary' // askdoc 문서 요약
  | 'AI Apps'
  | 'NOVA' // nova 시작
  | 'NOVAAsk' // nova 질의 중
  | 'ChangeBG' // nova 배경변경 prompt 작성
  | 'ExpandImg' // nova 이미지 사이즈 조절
  | 'Loading' // nova 로딩
  | 'Done' // nova 동작 완료
  | 'TimeOver'; // nova time over;

export type AI_WRITE_TAB_TYPE = 'write' | 'chat';

export enum NOVA_TAB_TYPE {
  aiChat = 'aiChat',
  convert2DTo3D = 'convert2DTo3D',
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
  usingAI: boolean;
}

const tabSlice = createSlice({
  name: 'tab',
  initialState: {
    creating: 'none',
    selectedTabId: 'write',
    selectedNovaTab: 'aiChat',
    showChatEOS: false,
    usingAI: false
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
    },
    setUsingAI: (state, action: PayloadAction<boolean>) => {
      state.usingAI = action.payload;
    }
  }
});

export const { initTab, setCreating, selectTab, selectNovaTab, setshowChatEOS, setUsingAI } =
  tabSlice.actions;
export const selectTabSlice = (state: RootState) => state.tab;
export default tabSlice.reducer;

export const shareAnswerState: Middleware = () => (next) => (action) => {
  if (action.type === 'tab/setCreating') {
    Bridge.callBridgeApi('shareAnswerState', action.payload);
  }
  return next(action);
};
