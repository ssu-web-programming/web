import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ToastType {
  active: boolean;
  msg: string;
}

const toastSlice = createSlice({
  name: 'toast',
  initialState: { active: false, msg: '' } as ToastType,
  reducers: {
    initToast: (state) => {
      state.active = false;
      state.msg = '';
    },
    activeToast: (state, action: PayloadAction<ToastType>) => {
      const { active, msg } = action.payload;
      state.active = active;
      state.msg = msg;
    }
  }
});

export const { initToast, activeToast } = toastSlice.actions;
export const selectToast = (state: RootState) => state.toast;
export default toastSlice.reducer;
