const CREDIT_NAME_MAP: { [key: string]: string } = {
  WRITE_GPT4O: 'GPT 4o',
  WRITE_GPT4: 'GPT 4',
  GPT3: 'GPT 3.5',
  WRITE_CLOVA: 'CLOVA X',
  WRITE_CLADE3: 'Claude 3.5 Sonnet'
};

const CREDIT_DESCRITION_MAP: { [key: string]: string } = {
  WRITE_GPT4O: '언어 이해력이 뛰어나고 창의적이에요',
  WRITE_GPT4: '다양한 텍스트를 생성하는데 탁월해요',
  GPT3: '속도가 빨라 단순 작업을 잘 처리해요',
  WRITE_CLOVA: '한국어 작업에 효과적이에요',
  WRITE_CLADE3: '창의적인 글을 잘 쓰고 문학적 표현을 잘해요'
};

export { CREDIT_DESCRITION_MAP, CREDIT_NAME_MAP };
