import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface confirmType {
  msg: string | React.ReactNode | null;
  btnFunc?: () => void;
}

const confirmSlice = createSlice({
  name: 'confirm',
  initialState: { msg: '', btnFunc: undefined } as confirmType,
  reducers: {
    initConfirm: (state) => {
      state.msg = null;
      state.btnFunc = undefined;
    },
    activeConfirm: (
      state,
      action: PayloadAction<{ msg: string | React.ReactNode; btnFunc?: () => void }>
    ) => {
      state.msg = action.payload.msg;
      state.btnFunc = action.payload.btnFunc;
    }
  }
});

export const { initConfirm, activeConfirm } = confirmSlice.actions;
export const selectConfirm = (state: RootState) => state.confirm;
export default confirmSlice.reducer;
