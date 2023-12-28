import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type InitialState = {
  isInit: boolean;
};

const initState: InitialState = {
  isInit: false
};

const initFlagSlice = createSlice({
  name: 'analyzeFiles',
  initialState: initState,
  reducers: {
    init: () => initState,
    initComplete: (state, action: PayloadAction<InitialState>) => {
      state = { ...action.payload };
      return state;
    }
  }
});

export const { init, initComplete } = initFlagSlice.actions;
export const initFlagSelector = (state: RootState) => state.initFlagSlice;
export default initFlagSlice.reducer;
