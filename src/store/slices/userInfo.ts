import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type InitialState = {
  novaAgreement: boolean;
  userInfo: {
    us: string;
    uid: string;
    ul: string;
  };
};

const initialState: InitialState = {
  novaAgreement: false,
  userInfo: {
    us: '',
    uid: '',
    ul: ''
  }
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setNovaAgreement: (state, action: PayloadAction<boolean>) => {
      state.novaAgreement = action.payload;
      return state;
    },
    setUserInfo: (state, action: PayloadAction<InitialState['userInfo']>) => {
      state.userInfo = action.payload;
      return state;
    }
  }
});

export const { setNovaAgreement, setUserInfo } = userInfoSlice.actions;
export const userInfoSelector = (state: RootState) => state.userInfo;
export default userInfoSlice.reducer;
