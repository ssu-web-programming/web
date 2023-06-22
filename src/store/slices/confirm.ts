import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface confirmType {
  active: boolean;
  msg: string | React.ReactNode;
  btnFunc?: Function;
}

const confirmSlice = createSlice({
  name: 'confirm',
  initialState: { active: false, msg: '', btnFunc: undefined } as confirmType,
  reducers: {
    initConfirm: (state) => {
      state.active = false;
      state.msg = '';
      state.btnFunc = undefined;
    },
    activeConfirm: (
      state,
      action: PayloadAction<{ msg: string | React.ReactNode; btnFunc?: Function }>
    ) => {
      state.active = true;
      state.msg = action.payload.msg;
      state.btnFunc = action.payload.btnFunc;
    }
  }
});

export const { initConfirm, activeConfirm } = confirmSlice.actions;
export const selectConfirm = (state: RootState) => state.confirm;
export default confirmSlice.reducer;
