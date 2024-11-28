import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

export type ScreenType = 'min' | 'max';

export interface ScreenSlice {
  screenMode: ScreenType;
}

const initialState: ScreenSlice = {
  screenMode: 'min'
};

const screenModeSlice = createSlice({
  name: 'screenMode',
  initialState: initialState,
  reducers: {
    initScreenMode: () => initialState,
    setScreenMode: (state, action: PayloadAction<ScreenType>) => {
      state.screenMode = action.payload;
      return state;
    }
  }
});

export const { initScreenMode, setScreenMode } = screenModeSlice.actions;
export const screenModeSelector = (state: RootState) => state.screenMode;
export default screenModeSlice.reducer;
