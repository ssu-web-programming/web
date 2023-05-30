import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ToastType {
  active: boolean;
  isError: boolean;
  msg: string | React.ReactNode;
}

const toastSlice = createSlice({
  name: 'toast',
  initialState: { active: false, msg: '', isError: false } as ToastType,
  reducers: {
    initToast: (state) => {
      state.active = false;
      state.msg = '';
    },
    activeToast: (state, action: PayloadAction<ToastType>) => {
      const { active, msg, isError } = action.payload;
      state.active = active;
      state.msg = msg;
      state.isError = isError;
    }
  }
});

export const { initToast, activeToast } = toastSlice.actions;
export const selectToast = (state: RootState) => state.toast;
export default toastSlice.reducer;
