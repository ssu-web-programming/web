import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

type DocType = string;
type InitialState = {
  docType: DocType;
  novaExpireTime: number;
  isStartedByRibbon: boolean;
  isIncomingCall: boolean;
  // not-started (녹음을 시작하지도 않음) , start(녹음을 시작함) , pause('녹음을 중지함');
  isRecordState: 'not-started' | 'start' | 'pause';
};

const initialState: InitialState = {
  docType: 'unknown',
  novaExpireTime: 1800000,
  isStartedByRibbon: true,
  // 전화 여부 추가
  isIncomingCall: false,
  isRecordState: 'not-started'
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setDocType: (state, action: PayloadAction<DocType>) => {
      state.docType = action.payload;
      return state;
    },
    setNovaExpireTime: (state, action: PayloadAction<number>) => {
      state.novaExpireTime = action.payload;
      return state;
    },
    setIsStartedByRibbon: (state, action: PayloadAction<boolean>) => {
      state.isStartedByRibbon = action.payload;
      return state;
    },
    setIsCallState: (state, action: PayloadAction<boolean>) => {
      state.isIncomingCall = action.payload;
      return state;
    },
    setIsRecordingState: (state, action: PayloadAction<'not-started' | 'start' | 'pause'>) => {
      state.isRecordState = action.payload;
      return state;
    }
  }
});

export const {
  setDocType,
  setNovaExpireTime,
  setIsStartedByRibbon,
  setIsCallState,
  setIsRecordingState
} = appStateSlice.actions;
export const appStateSelector = (state: RootState) => state.appState;
export default appStateSlice.reducer;
