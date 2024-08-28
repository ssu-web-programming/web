import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { InitialState } from './creditInfo';

export enum IEventType {
  UNKNOWN = -1,
  AI_STAMP_EVENT = 0,
  DONATION_10TH_ANNIVERSARY_EVENT = 1,
  AI_NOVA_LUCKY_EVENT = 2
}

export enum IAccurePromotionAction {
  UNKNOWN = 'UNKNOWN',
  USE_AIWRITE = 'USE_AIWRITE',
  USE_ASKDOC = 'USE_ASKDOC',
  USE_TEXTTOIMAGE = 'USE_TEXTTOIMAGE',
  USE_AI_OVER_3DAYS = 'USE_AI_OVER_3DAYS',
  USE_AICREDIT_OVER_50 = 'USE_AICREDIT_OVER_50',
  PAID_NON_AILEVEL = 'PAID_NON_AILEVEL',
  PAID_AILEVEL = 'PAID_AILEVEL',
  DONATION_10TH_ANNIVERSARY = 'DONATION_10TH_ANNIVERSARY',
  WIN_STARBUCK_COUPON = 'WIN_STARBUCK_COUPON',
  WIN_BUZ = 'WIN_BUZ',
  WIN_IPAD = 'WIN_IPAD'
}

type IAccurePromotionUserStatus = null | 'VALID' | 'ALREADY_USED' | 'NO_AGREEMENT_DATA';

export type IPromotionUserInfo = {
  type: IEventType;
  accureAction: IAccurePromotionAction[];
  idUser: string;
  timeUpdate: number;
  timeRegist: number;
  point: number;
  status: IAccurePromotionUserStatus;
};

const initialState: IPromotionUserInfo = {
  type: -1,
  accureAction: [],
  idUser: '',
  timeUpdate: 0,
  timeRegist: 0,
  point: 0,
  status: null
};

const promotionUserInfo = createSlice({
  name: 'promotionUserInfo',
  initialState: initialState,
  reducers: {
    initPromotionUserInfo: () => initialState,
    setPromotionUserInfo: (state, action: PayloadAction<IPromotionUserInfo>) => {
      state = { ...action.payload };
      return state;
    }
  }
});

export const { initPromotionUserInfo, setPromotionUserInfo } = promotionUserInfo.actions;
export const userInfoSelector = (state: RootState) => state.promotionUserInfo;
export default promotionUserInfo.reducer;
