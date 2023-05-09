import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface BridgeState {
  cmd: string;
  body: string;
}

const initialState: BridgeState = { cmd: '', body: '' };

const bridgeMessageSlice = createSlice({
  name: 'bridge',
  initialState: initialState,
  reducers: {
    initBridgeMessage: () => initialState,
    setBridgeMessage: (state, action: PayloadAction<BridgeState>) => {
      state.cmd = action.payload.cmd;
      state.body = action.payload.body;
    }
  }
});

export const { initBridgeMessage, setBridgeMessage } = bridgeMessageSlice.actions;
export const selectBridgeMessage = (state: RootState) => state.bridge;
export default bridgeMessageSlice.reducer;
