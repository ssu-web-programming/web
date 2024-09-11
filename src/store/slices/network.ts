import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

const networkSlice = createSlice({
  name: 'network',
  initialState: { online: true },
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    }
  }
});

export const { setOnlineStatus } = networkSlice.actions;
export const selectNetwork = (state: RootState) => state.network;
export default networkSlice.reducer;
