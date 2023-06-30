import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ToastType } from '../../components/toast/Toast';

interface ToastProps {
  type: ToastType;
  msg: string | React.ReactNode;
}

const initState: ToastProps = {
  type: 'none',
  msg: ''
};

const toastSlice = createSlice({
  name: 'toast',
  initialState: initState,
  reducers: {
    initToast: () => initState,
    activeToast: (state, action: PayloadAction<ToastProps>) => {
      state = { ...action.payload };
      return state;
    }
  }
});

export const { initToast, activeToast } = toastSlice.actions;
export const selectToast = (state: RootState) => state.toast;
export default toastSlice.reducer;
