export const ERR_NOT_ONLINE = 'ERR_NOT_ONLINE';
export const ERR_INVALID_SESSION = 'ERR_INVALID_SESSION';
export const INVALID_PROMPT = 'INVALID_PROMPT';
export const GPT_EXCEEDED_LIMIT = 'GPT_EXCEEDED_LIMIT';
export const EXCEED_PO_DRIVE_LIMIT = 'EXCEED_PO_DRIVE_LIMIT';
export const ERR_DOC_CONVERT = 'ERR_DOC_CONVERT';
export const ERR_DOC_UNOPENABLE = 'ERR_DOC_UNOPENABLE';
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

export class ExceedPoDriveLimitError extends Error {
  constructor() {
    super(EXCEED_PO_DRIVE_LIMIT);
  }
}

export class DocConvertingError extends Error {
  constructor() {
    super(ERR_DOC_CONVERT);
  }
}

type UnopeanbleType = {
  type: 'PASSWORD' | 'UNOPENABLE_DOCUMENT';
  filename: string;
};
export class DocUnopenableError extends Error {
  errorInfos: UnopeanbleType[];
  constructor(errorInfos: UnopeanbleType[]) {
    super(ERR_DOC_UNOPENABLE);
    this.errorInfos = errorInfos;
  }
}
