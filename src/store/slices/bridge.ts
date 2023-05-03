import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface BridgeState {
  message: string;
}

const bridgeMessageSlice = createSlice({
  name: 'bridge',
  initialState: { message: '' } as BridgeState,
  reducers: {
    setBridgeMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    }
  }
});

export const { setBridgeMessage } = bridgeMessageSlice.actions;
export const selectBridgeMessage = (state: RootState) => state.bridge.message;
export default bridgeMessageSlice.reducer;
