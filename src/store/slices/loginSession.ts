import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface LoginSessionType {
  AID: string;
  BID: string;
  SID: string;
}

const loginSessionSlice = createSlice({
  name: 'loginSession',
  initialState: { AID: '', BID: '', SID: '' } as LoginSessionType,
  reducers: {
    setLoginSession: (state, action: PayloadAction<LoginSessionType>) => {
      state = action.payload;
    }
  }
});

export const { setLoginSession } = loginSessionSlice.actions;
export const selectLoginSessionSlice = (state: RootState) => state.loginSession;
export default loginSessionSlice.reducer;
