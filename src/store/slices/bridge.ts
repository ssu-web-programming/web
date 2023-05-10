import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface BridgeState {
  cmd: string;
  body: string;
}

const initialState: BridgeState[] = [{ cmd: '', body: '' }];

const bridgeMessageSlice = createSlice({
  name: 'bridge',
  initialState: initialState,
  reducers: {
    setBridgeMessage: (state, action: PayloadAction<BridgeState>) => {
      state = [...state, action.payload];
      return state;
    }
  }
});

export const { setBridgeMessage } = bridgeMessageSlice.actions;
export const selectBridgeMessage = (state: RootState) => state.bridge;
export default bridgeMessageSlice.reducer;
