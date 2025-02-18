export interface ICreditInfo {
  type: string;
  offerCredit: number;
  offerType: string;
}

export interface IOfferCredit {
  status: string;
  credit: number;
  usedCredit: number;
  timeUpdate: number;
  timeRegist: number;
  timeExpired: number;
  description: string;
  creditInfo: ICreditInfo;
}
