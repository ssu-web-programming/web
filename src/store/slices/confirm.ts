import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

export interface ConfirmType {
  title?: string;
  msg: string | React.ReactNode | null;
  onCancel?: { text: string; callback: () => void };
  onOk: { text: string; callback: () => void };
  direction?: 'row' | 'column';
}

const initialState: ConfirmType = {
  title: '',
  msg: null,
  onCancel: {
    text: '',
    callback: () => {}
  },
  onOk: {
    text: '',
    callback: () => {}
  },
  direction: 'column'
};

const confirmSlice = createSlice({
  name: 'confirm',
  initialState: initialState,
  reducers: {
    initConfirm: () => initialState,
    activeConfirm: (state, action: PayloadAction<ConfirmType>) => {
      state = action.payload;
      return state;
    }
  }
});

export const { initConfirm, activeConfirm } = confirmSlice.actions;
export const selectConfirm = (state: RootState) => state.confirm;
export default confirmSlice.reducer;
