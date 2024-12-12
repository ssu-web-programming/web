import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

export enum ThemeType {
  light = 'light',
  dark = 'dark'
}

type InitialState = {
  theme: ThemeType;
};

const initialState: InitialState = {
  theme: ThemeType.dark
};

const themeInfo = createSlice({
  name: 'themeInfo',
  initialState,
  reducers: {
    setThemeInfo: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
    }
  }
});

export const { setThemeInfo } = themeInfo.actions;
export const themeInfoSelector = (state: RootState) => ({
  curTheme: state.theme.theme,
  isLightMode: state.theme.theme === ThemeType.light
});
export default themeInfo.reducer;
