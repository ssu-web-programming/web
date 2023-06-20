import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const bannerSlice = createSlice({
  name: 'banner',
  initialState: { active: false } as { active: boolean },
  reducers: {
    initBanner: (state) => {
      state.active = false;
    },
    activeBanner: (state) => {
      state.active = true;
    },
    setBanner: (state, action: PayloadAction<boolean>) => {
      state.active = action.payload;
    }
  }
});

export const { initBanner, activeBanner, setBanner } = bannerSlice.actions;
export const selectBanner = (state: RootState) => state.banner;
export default bannerSlice.reducer;
