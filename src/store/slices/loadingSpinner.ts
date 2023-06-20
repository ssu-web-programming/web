import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface loadingSpinnerType {
  active: boolean;
  msg?: string | React.ReactNode;
}

const loadingSpinnerSlice = createSlice({
  name: 'loadingSpinner',
  initialState: { active: false } as loadingSpinnerType,
  reducers: {
    initLoadingSpinner: (state) => {
      state.active = false;
      state.msg = '';
    },
    activeLoadingSpinner: (state, action: PayloadAction<string | React.ReactNode>) => {
      state.active = true;
      state.msg = action.payload;
    }
  }
});

export const { initLoadingSpinner, activeLoadingSpinner } = loadingSpinnerSlice.actions;
export const selectLoadingSpinner = (state: RootState) => state.loadingSpinner;
export default loadingSpinnerSlice.reducer;
