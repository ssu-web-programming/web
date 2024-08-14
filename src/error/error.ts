export const ERR_NOT_ONLINE = 'ERR_NOT_ONLINE';
export const ERR_INVALID_SESSION = 'ERR_INVALID_SESSION';
export const INVALID_PROMPT = 'INVALID_PROMPT';
export const GPT_EXCEEDED_LIMIT = 'GPT_EXCEEDED_LIMIT';
const EXCEED_PO_DRIVE_LIMIT = 'EXCEED_PO_DRIVE_LIMIT';
const ERR_DOC_CONVERT = 'ERR_DOC_CONVERT';
const ERR_DOC_UNOPENABLE = 'ERR_DOC_UNOPENABLE';
const NOT_ENOUGH_CREDIT = 'NOT_ENOUGH_CREDIT';
const DELAY_DOC_CONVERTING = 'DELAY_DOC_CONVERTING';
const NO_FILE_IN_DRIVE = 'NO_FILE_IN_DRIVE';

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

export class DelayDocConverting extends Error {
  constructor() {
    super(DELAY_DOC_CONVERTING);
  }
}

export class NoFileInDrive extends Error {
  constructor() {
    super(NO_FILE_IN_DRIVE);
  }
}
