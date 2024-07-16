import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type InitialState = {
  novaAgreement: boolean;
};

const initialState: InitialState = {
  novaAgreement: false
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setNovaAgreement: (state, action: PayloadAction<boolean>) => {
      state.novaAgreement = action.payload;
      return state;
    }
  }
});

export const { setNovaAgreement } = userInfoSlice.actions;
export const userInfoSelector = (state: RootState) => state.userInfo;
export default userInfoSlice.reducer;
