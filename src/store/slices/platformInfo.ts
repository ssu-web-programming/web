import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

export enum ClientType {
  unknown = 'unknown',
  android = 'android',
  ios = 'ios',
  mac = 'mac',
  windows = 'windows',
  web = 'web'
}

export enum DeviceType {
  unknown = 'unknown',
  phone = 'phone',
  pad = 'pad'
}

type InitialState = {
  platform: ClientType;
  device: DeviceType;
  version: string;
};

const initialState: InitialState = {
  platform: ClientType.unknown,
  device: DeviceType.unknown,
  version: ''
};

const platformInfo = createSlice({
  name: 'platformInfo',
  initialState,
  reducers: {
    setPlatformInfo: (state, action: PayloadAction<InitialState>) => {
      const { platform, version, device } = action.payload;
      state.platform = platform;
      state.device = device;
      state.version = version;
      return state;
    }
  }
});

export const { setPlatformInfo } = platformInfo.actions;
export const platformInfoSelector = (state: RootState) => state.platformInfo;
export default platformInfo.reducer;
