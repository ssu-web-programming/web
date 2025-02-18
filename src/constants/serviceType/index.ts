import { TFunction } from 'i18next';
import VoiceDictationIcon from 'img/common/nova/imgSample/voice_dictation_sample.svg';

import ChangeBGIcon from '../../img/common/nova/imgSample/bg_change_sample.png';
import RemoveBGIcon from '../../img/common/nova/imgSample/bg_delete_sample.png';
import Convert2DTo3DIcon from '../../img/common/nova/imgSample/convert_2dto3d_smaple.gif';
import AIVideoIcon from '../../img/common/nova/imgSample/ico_ai_video.svg';
import TranslationIcon from '../../img/common/nova/imgSample/ico_translation.svg';
import ExpandImgIcon from '../../img/common/nova/imgSample/image_expand_sample.png';
import RemakeImgIcon from '../../img/common/nova/imgSample/image_remake_sample.png';
import ChangeStyleIcon from '../../img/common/nova/imgSample/image_style_sample.png';
import ImprovedResIcon from '../../img/common/nova/imgSample/image_upscaling_sample.png';
import ClaudeLogoDarkIcon from '../../img/dark/nova/logo/ico_claude_logo.svg';
import ClovaLogoDarkIcon from '../../img/dark/nova/logo/ico_clova_logo.svg';
import GPTLogoDarkIcon from '../../img/dark/nova/logo/ico_gpt_logo.svg';
import PerplexityLogoDarkIcon from '../../img/dark/nova/logo/ico_perplexity_logo.svg';
import ClaudeLogoLightIcon from '../../img/light/nova/logo/ico_claude_logo.svg';
import ClovaLogoLightIcon from '../../img/light/nova/logo/ico_clova_logo.svg';
import GPTLogoLightIcon from '../../img/light/nova/logo/ico_gpt_logo.svg';
import PerplexityLogoLightIcon from '../../img/light/nova/logo/ico_perplexity_logo.svg';
import { NOVA_TAB_TYPE } from '../novaTapTypes';

export enum SERVICE_CATEGORY {
  CHAT = 'CHAT',
  TOOLS = 'TOOLS',
  IMAGE = 'IMAGE'
}

export enum SERVICE_TYPE {
  // Chat
  NOVA_CHAT_GPT4O = 'NOVA_CHAT_GPT4O', // 5
  NOVA_IMG_GPT4O = 'NOVA_IMG_GPT4O', // 10
  NOVA_ASK_DOC_GPT4O = 'NOVA_ASK_DOC_GPT4O', // 10
  NOVA_ASK_IMG_GPT4O = 'NOVA_ASK_IMG_GPT4O', // 10
  WRITE_GPT4 = 'WRITE_GPT4', // 5
  GPT3 = 'GPT3', // 2
  NOVA_CHAT_O3MINI = 'NOVA_CHAT_O3MINI', // 2
  WRITE_CLOVA = 'WRITE_CLOVA', // 2
  WRITE_CLADE3 = 'WRITE_CLADE3', // 5

  // Tools
  NOVA_WEBSEARCH_PERPLEXITY = 'NOVA_WEBSEARCH_PERPLEXITY', // 5
  NOVA_WEBSEARCH_SONAR_REASONING_PRO = 'NOVA_WEBSEARCH_SONAR_REASONING_PRO', // 10
  NOVA_TRANSLATION_DEEPL = 'NOVA_TRANSLATION_DEEPL', // 20
  NOVA_SPEECH_RECOGNITION_CLOVA = 'NOVA_SPEECH_RECOGNITION_CLOVA', // 30
  NOVA_AI_AVATA_VIDEO_HEYGEN = 'NOVA_AI_AVATA_VIDEO_HEYGEN', // 10

  // Image
  NOVA_REMOVE_BG = 'NOVA_REMOVE_BG', // 10
  NOVA_PO_RESOLUTION = 'NOVA_PO_RESOLUTION', // 2
  NOVA_REPLACE_BG_CLIPDROP = 'NOVA_REPLACE_BG_CLIPDROP', // 10
  NOVA_REIMAGE_CLIPDROP = 'NOVA_REIMAGE_CLIPDROP', // 10
  NOVA_UNCROP_CLIPDROP = 'NOVA_UNCROP_CLIPDROP', // 10
  NOVA_PO_STYLE_TRANSFER = 'NOVA_PO_STYLE_TRANSFER', // 10
  NOVA_ANIMATION_3D_IMMERSITY = 'NOVA_ANIMATION_3D_IMMERSITY', // 10

  //Voice
  NOVA_VOICE_DICTATION = 'NOVA_VOICE_DICTATION'
}

export const TAB_SERVICE_MAP: Record<NOVA_TAB_TYPE, SERVICE_TYPE[]> = {
  [NOVA_TAB_TYPE.home]: [],

  // Chat
  [NOVA_TAB_TYPE.aiChat]: [
    SERVICE_TYPE.NOVA_CHAT_GPT4O,
    SERVICE_TYPE.NOVA_IMG_GPT4O,
    SERVICE_TYPE.NOVA_ASK_DOC_GPT4O,
    SERVICE_TYPE.NOVA_ASK_IMG_GPT4O,
    SERVICE_TYPE.WRITE_GPT4,
    SERVICE_TYPE.GPT3,
    SERVICE_TYPE.NOVA_CHAT_O3MINI,
    SERVICE_TYPE.WRITE_CLOVA,
    SERVICE_TYPE.WRITE_CLADE3
  ],
  [NOVA_TAB_TYPE.perplexity]: [
    SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY,
    SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
  ],

  // Tools
  [NOVA_TAB_TYPE.translation]: [SERVICE_TYPE.NOVA_TRANSLATION_DEEPL],
  [NOVA_TAB_TYPE.voiceDictation]: [SERVICE_TYPE.NOVA_SPEECH_RECOGNITION_CLOVA],
  [NOVA_TAB_TYPE.aiVideo]: [SERVICE_TYPE.NOVA_AI_AVATA_VIDEO_HEYGEN],

  // Image
  [NOVA_TAB_TYPE.removeBG]: [SERVICE_TYPE.NOVA_REMOVE_BG],
  [NOVA_TAB_TYPE.changeBG]: [SERVICE_TYPE.NOVA_REPLACE_BG_CLIPDROP],
  [NOVA_TAB_TYPE.remakeImg]: [SERVICE_TYPE.NOVA_REIMAGE_CLIPDROP],
  [NOVA_TAB_TYPE.expandImg]: [SERVICE_TYPE.NOVA_UNCROP_CLIPDROP],
  [NOVA_TAB_TYPE.improvedRes]: [SERVICE_TYPE.NOVA_PO_RESOLUTION],
  [NOVA_TAB_TYPE.changeStyle]: [SERVICE_TYPE.NOVA_PO_STYLE_TRANSFER],
  [NOVA_TAB_TYPE.convert2DTo3D]: [SERVICE_TYPE.NOVA_ANIMATION_3D_IMMERSITY]
};

export const SERVICE_GROUP_MAP: Record<SERVICE_CATEGORY, Record<string, SERVICE_TYPE[]>> = {
  [SERVICE_CATEGORY.CHAT]: {
    chat: [
      SERVICE_TYPE.NOVA_CHAT_GPT4O,
      SERVICE_TYPE.NOVA_CHAT_O3MINI,
      SERVICE_TYPE.WRITE_GPT4,
      SERVICE_TYPE.GPT3,
      SERVICE_TYPE.WRITE_CLOVA,
      SERVICE_TYPE.WRITE_CLADE3
    ],
    docImgQuery: [SERVICE_TYPE.NOVA_ASK_DOC_GPT4O, SERVICE_TYPE.NOVA_ASK_IMG_GPT4O],
    imgGen: [SERVICE_TYPE.NOVA_IMG_GPT4O]
  },
  [SERVICE_CATEGORY.TOOLS]: {
    perplexity: [
      SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY,
      SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
    ],
    translation: [SERVICE_TYPE.NOVA_TRANSLATION_DEEPL],
    voiceDictation: [SERVICE_TYPE.NOVA_SPEECH_RECOGNITION_CLOVA],
    aiVideo: [SERVICE_TYPE.NOVA_AI_AVATA_VIDEO_HEYGEN]
  },
  [SERVICE_CATEGORY.IMAGE]: {
    removeBG: [SERVICE_TYPE.NOVA_REMOVE_BG],
    improvedRes: [SERVICE_TYPE.NOVA_PO_RESOLUTION],
    changeBG: [SERVICE_TYPE.NOVA_REPLACE_BG_CLIPDROP],
    expandImg: [SERVICE_TYPE.NOVA_UNCROP_CLIPDROP],
    remakeImg: [SERVICE_TYPE.NOVA_REIMAGE_CLIPDROP],
    changeStyle: [SERVICE_TYPE.NOVA_PO_STYLE_TRANSFER],
    convert2DTo3D: [SERVICE_TYPE.NOVA_ANIMATION_3D_IMMERSITY]
  }
};

export const CHAT_GROUP_MAP: Record<string, SERVICE_TYPE[] | SERVICE_TYPE> = {
  GPT_4O: [
    SERVICE_TYPE.NOVA_CHAT_GPT4O,
    SERVICE_TYPE.NOVA_ASK_DOC_GPT4O,
    SERVICE_TYPE.NOVA_ASK_IMG_GPT4O,
    SERVICE_TYPE.NOVA_IMG_GPT4O
  ],
  GPT_O3_MINI: SERVICE_TYPE.NOVA_CHAT_O3MINI,
  GPT_4: SERVICE_TYPE.WRITE_GPT4,
  GPT_3_5: SERVICE_TYPE.GPT3,
  CLOVA_X: SERVICE_TYPE.WRITE_CLOVA,
  CLAUDE_3_5: SERVICE_TYPE.WRITE_CLADE3,
  PERPLEXITY: SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY,
  PERPLEXITY_REASONING_PRO: SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO,
  NOVA_VOICE_DICTATION: SERVICE_TYPE.NOVA_VOICE_DICTATION
};

export const getChatGroupKey = (serviceType: SERVICE_TYPE): string => {
  const matchedKey = Object.keys(CHAT_GROUP_MAP).find((key) => {
    const value = CHAT_GROUP_MAP[key];
    return Array.isArray(value) ? value.includes(serviceType) : value === serviceType;
  });

  return matchedKey || 'UNKNOWN';
};

const GROUP_INFO_MAP: Record<string, { label: string; icon: (isLightMode: boolean) => string }> = {
  GPT_4O: {
    label: 'GPT-4o',
    icon: (isLightMode) => (isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon)
  },
  GPT_O3_MINI: {
    label: 'GPT-O3-mini',
    icon: (isLightMode) => (isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon)
  },
  GPT_4: {
    label: 'GPT-4',
    icon: (isLightMode) => (isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon)
  },
  GPT_3_5: {
    label: 'GPT-3.5',
    icon: (isLightMode) => (isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon)
  },
  CLOVA_X: {
    label: 'CLOVA X',
    icon: (isLightMode) => (isLightMode ? ClovaLogoLightIcon : ClovaLogoDarkIcon)
  },
  CLAUDE_3_5: {
    label: 'Claude 3.5 Sonnet',
    icon: (isLightMode) => (isLightMode ? ClaudeLogoLightIcon : ClaudeLogoDarkIcon)
  },
  PERPLEXITY: {
    label: 'Perplexity',
    icon: (isLightMode) => (isLightMode ? PerplexityLogoLightIcon : PerplexityLogoDarkIcon)
  },
  PERPLEXITY_REASONING_PRO: {
    label: 'Perplexity Reasoning Pro',
    icon: (isLightMode) => (isLightMode ? PerplexityLogoLightIcon : PerplexityLogoDarkIcon)
  },
  NOVA_VOICE_DICTATION: {
    label: '받아쓰기',
    icon: (isLightMode) => (isLightMode ? VoiceDictationIcon : VoiceDictationIcon)
  }
};

export const iconMap: Record<NOVA_TAB_TYPE, string> = {
  home: '',
  aiChat: '',
  perplexity: '',
  convert2DTo3D: Convert2DTo3DIcon,
  removeBG: RemoveBGIcon,
  changeBG: ChangeBGIcon,
  remakeImg: RemakeImgIcon,
  expandImg: ExpandImgIcon,
  improvedRes: ImprovedResIcon,
  changeStyle: ChangeStyleIcon,
  translation: TranslationIcon,
  voiceDictation: VoiceDictationIcon,
  aiVideo: AIVideoIcon
};

export const getServiceGroupInfo = (groupKey: string, isLightMode: boolean) => {
  const group = GROUP_INFO_MAP[groupKey];

  return group
    ? { label: group.label, icon: group.icon(isLightMode) }
    : { label: 'Unknown', icon: '' };
};

export const getServiceCategoryFromTab = (tab: NOVA_TAB_TYPE): SERVICE_CATEGORY | null => {
  for (const [category, services] of Object.entries(SERVICE_GROUP_MAP)) {
    for (const key in services) {
      if (TAB_SERVICE_MAP[tab]?.some((service) => services[key].includes(service))) {
        return category as SERVICE_CATEGORY;
      }
    }
  }
  return null;
};

export const getMenuItemsFromServiceGroup = (
  serviceCredits: Record<SERVICE_TYPE, number>,
  isLightMode: boolean,
  t: TFunction
) => {
  return Object.entries(CHAT_GROUP_MAP).map(([groupKey, services]) => {
    const { icon, label } = getServiceGroupInfo(groupKey, isLightMode);

    const credits = (Array.isArray(services) ? services : [services])
      .map((service) => serviceCredits[service] ?? 0)
      .filter((credit) => credit > 0);

    const minCredit = Math.min(...credits);
    const maxCredit = Math.max(...credits);

    return {
      icon,
      key: Array.isArray(services) ? services[0] : services,
      title: label,
      desc: t(`Nova.ChatModel.${groupKey}.desc`),
      credit: minCredit === maxCredit ? maxCredit.toString() : `${minCredit}~${maxCredit}`
    };
  });
};

export const getServiceEngineName = (serviceType: SERVICE_TYPE): string | undefined => {
  const mapping: Partial<Record<SERVICE_TYPE, string>> = {
    [SERVICE_TYPE.NOVA_CHAT_GPT4O]: 'gpt4o',
    [SERVICE_TYPE.NOVA_IMG_GPT4O]: 'gpt4o',
    [SERVICE_TYPE.NOVA_ASK_DOC_GPT4O]: 'gpt4o',
    [SERVICE_TYPE.NOVA_ASK_IMG_GPT4O]: 'gpt4o',
    [SERVICE_TYPE.WRITE_GPT4]: 'gpt4o',
    [SERVICE_TYPE.GPT3]: 'gpt3.5',
    [SERVICE_TYPE.WRITE_CLADE3]: 'claude',
    [SERVICE_TYPE.WRITE_CLOVA]: 'clovax',
    [SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY]: 'sonar',
    [SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO]: 'sonar-reasoning-pro',
    [SERVICE_TYPE.NOVA_CHAT_O3MINI]: 'o3-mini'
  };

  return mapping[serviceType] || 'unknown';
};
