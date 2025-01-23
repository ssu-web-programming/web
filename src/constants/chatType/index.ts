import ClaudeLogoDarkIcon from '../../img/dark/nova/logo/ico_claude_logo.svg';
import ClovaLogoDarkIcon from '../../img/dark/nova/logo/ico_clova_logo.svg';
import GPTLogoDarkIcon from '../../img/dark/nova/logo/ico_gpt_logo.svg';
import PerplexityLogoDarkIcon from '../../img/dark/nova/logo/ico_perplexity_logo.svg';
import ClaudeLogoLightIcon from '../../img/light/nova/logo/ico_claude_logo.svg';
import ClovaLogoLightIcon from '../../img/light/nova/logo/ico_clova_logo.svg';
import GPTLogoLightIcon from '../../img/light/nova/logo/ico_gpt_logo.svg';
import PerplexityLogoLightIcon from '../../img/light/nova/logo/ico_perplexity_logo.svg';

export const CHAT_MODES = {
  GPT_4O: 'GPT-4o',
  GPT_4: 'GPT-4',
  GPT_3_5: 'GPT-3.5',
  CLOVA_X: 'CLOVA X',
  CLAUDE_3_5: 'Claude 3.5 Sonnet',
  PERPLEXITY: 'Perplexity'
} as const;

export type ChatMode = (typeof CHAT_MODES)[keyof typeof CHAT_MODES];

export const getChatTypeList = (isLightMode: boolean) => [
  {
    icon: isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon,
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
    icon: isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon,
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
    icon: isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon,
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
    icon: isLightMode ? ClovaLogoLightIcon : ClovaLogoDarkIcon,
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
    icon: isLightMode ? ClaudeLogoLightIcon : ClaudeLogoDarkIcon,
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
    icon: isLightMode ? PerplexityLogoLightIcon : PerplexityLogoDarkIcon,
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

export const getChatEngine = (mode: ChatMode) => {
  switch (mode) {
    case 'GPT-3.5':
      return 'gpt3.5';
    case 'GPT-4':
      return 'gpt4';
    case 'GPT-4o':
      return 'gpt4o';
    case 'Claude 3.5 Sonnet':
      return 'claude';
    case 'CLOVA X':
      return 'clovax';
    case 'Perplexity':
      return 'perplexity';
    default:
      return '';
  }
};
