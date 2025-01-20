import ClaudeLogoIcon from '../../img/common/nova/ico_claude_logo.svg';
import ClovaLogoIcon from '../../img/common/nova/ico_clova_logo.svg';
import GPTLogoIcon from '../../img/common/nova/ico_gpt_logo.svg';
import PerplexityLogoIcon from '../../img/common/nova/ico_perplexity_logo.svg';

export const CHAT_MODES = {
  GPT_4O: 'GPT-4o',
  GPT_4: 'GPT-4',
  GPT_3_5: 'GPT-3.5',
  CLOVA_X: 'CLOVA X',
  CLAUDE_3_5: 'Claude 3.5 Sonnet',
  PERPLEXITY: 'Perplexity'
} as const;

export type ChatMode = (typeof CHAT_MODES)[keyof typeof CHAT_MODES];

export const CHAT_TYPE_LIST = [
  {
    icon: GPTLogoIcon,
    title: CHAT_MODES.GPT_4O,
    desc: '다양한 텍스트를 생성하는데 탁월해요',
    credit: 5,
    prompt: [
      'CES 혁신상이 뭔지 설명해줘1',
      '미래 도시 이미지를 그려줘1',
      '2025 전기차 시장의 성장 전망1'
    ]
  },
  {
    icon: GPTLogoIcon,
    title: CHAT_MODES.GPT_4,
    desc: '속도가 빨라 단순 작업을 잘 처리해요',
    credit: 5,
    prompt: [
      'CES 혁신상이 뭔지 설명해줘2',
      '미래 도시 이미지를 그려줘2',
      '2025 전기차 시장의 성장 전망2'
    ]
  },
  {
    icon: GPTLogoIcon,
    title: CHAT_MODES.GPT_3_5,
    desc: '속도가 빨라 단순 작업을 잘 처리해요',
    credit: 2,
    prompt: [
      'CES 혁신상이 뭔지 설명해줘3',
      '미래 도시 이미지를 그려줘3',
      '2025 전기차 시장의 성장 전망3'
    ]
  },
  {
    icon: ClovaLogoIcon,
    title: CHAT_MODES.CLOVA_X,
    desc: '한국어 작업에 효과적이에요',
    credit: 2,
    prompt: [
      'CES 혁신상이 뭔지 설명해줘4',
      '미래 도시 이미지를 그려줘4',
      '2025 전기차 시장의 성장 전망4'
    ]
  },
  {
    icon: ClaudeLogoIcon,
    title: CHAT_MODES.CLAUDE_3_5,
    desc: '창의적인 글을 잘 써요',
    credit: 5,
    prompt: [
      'CES 혁신상이 뭔지 설명해줘1',
      '미래 도시 이미지를 그려줘1',
      '2025 전기차 시장의 성장 전망1'
    ]
  },
  {
    icon: PerplexityLogoIcon,
    title: CHAT_MODES.PERPLEXITY,
    desc: '다양한 정보를 정확하게 제공해요',
    credit: 5,
    prompt: [
      'CES 혁신상이 뭔지 설명해줘5',
      '미래 도시 이미지를 그려줘5',
      '2025 전기차 시장의 성장 전망5'
    ]
  }
];
