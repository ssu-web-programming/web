import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type InitialState = {
  serviceType: string;
  status: string;
  deductCredit: number;
};

const creditInfoSlice = createSlice({
  name: 'creditInfo',
  initialState: [] as InitialState[],
  reducers: {
    setCreditInfo: (state, action: PayloadAction<InitialState[]>) => {
      state = action.payload;
      return state;
    }
  }
});

export const { setCreditInfo } = creditInfoSlice.actions;
export const creditInfoSelector = (state: RootState) => state.creditInfo;
export default creditInfoSlice.reducer;
