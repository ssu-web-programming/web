import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ClientType } from '../../util/bridge';
import { RootState } from '../store';

type InitialState = {
  platform: ClientType;
  version: string;
};

const initialState: InitialState = {
  platform: ClientType.unknown,
  version: ''
};

const platformInfo = createSlice({
  name: 'platformInfo',
  initialState,
  reducers: {
    setPlatformInfo: (state, action: PayloadAction<InitialState['userInfo']>) => {
      const { platform, version } = action.payload;
      state.platform = platform;
      state.version = version;
      return state;
    }
  }
});

export const { setPlatformInfo } = platformInfo.actions;
export const platformInfoSelector = (state: RootState) => state.platformInfo;
export default platformInfo.reducer;
