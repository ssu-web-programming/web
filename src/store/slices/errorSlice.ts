import { RootState } from 'store/store';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
  isError: boolean;
  errorTitle?: string;
  onRetry?: () => void; // onRetry 함수 추가
}

const initialState: ErrorState = {
  isError: false,
  errorTitle: undefined,
  onRetry: undefined
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (
      state,
      action: PayloadAction<{
        title?: string;
        onRetry?: () => void;
      }>
    ) => {
      state.isError = true;
      state.errorTitle = action.payload.title;
      state.onRetry = action.payload.onRetry;
    },
    clearError: (state) => {
      state.isError = false;
      state.errorTitle = undefined;
      state.onRetry = undefined;
    }
  }
});

export const { setError, clearError } = errorSlice.actions;
export const errorSelector = (state: RootState) => state.errorSlice;

export default errorSlice.reducer;
