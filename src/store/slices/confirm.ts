import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ConfirmType {
  msg: string | React.ReactNode | null;
  onOk: { text: string; callback: () => void };
  onCancel: { text: string; callback: () => void };
}

const confirmSlice = createSlice({
  name: 'confirm',
  initialState: { msg: '', onOk: {}, onCancel: {} } as ConfirmType,
  reducers: {
    initConfirm: (state) => {
      state.msg = null;
      state.onOk = {
        text: '',
        callback: () => false
      };
      state.onCancel = { text: '', callback: () => false };
    },
    activeConfirm: (state, action: PayloadAction<ConfirmType>) => {
      state = action.payload;
      return state;
    }
  }
});

export const { initConfirm, activeConfirm } = confirmSlice.actions;
export const selectConfirm = (state: RootState) => state.confirm;
export default confirmSlice.reducer;
