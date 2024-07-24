export const ERR_NOT_ONLINE = 'ERR_NOT_ONLINE';
export const ERR_INVALID_SESSION = 'ERR_INVALID_SESSION';
export const INVALID_PROMPT = 'INVALID_PROMPT';
export const GPT_EXCEEDED_LIMIT = 'GPT_EXCEEDED_LIMIT';
const NOT_ENOUGH_CREDIT = 'NOT_ENOUGH_CREDIT';

interface CreditStatus {
  current: number;
  necessary: number;
}
export class NoCreditError extends Error {
  credit: CreditStatus;
  constructor(credit: CreditStatus) {
    super(NOT_ENOUGH_CREDIT);
    this.credit = credit;
  }
}

export class NovaNoCreditError extends Error {
  credit: CreditStatus;
  constructor(credit: CreditStatus) {
    super(NOT_ENOUGH_CREDIT);
    this.credit = credit;
  }
}
