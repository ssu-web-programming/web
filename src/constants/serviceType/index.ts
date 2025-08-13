import { TFunction } from 'i18next';

import ChangeBGIcon from '../../img/common/nova/imgSample/bg_change_sample.png';
import RemoveBGIcon from '../../img/common/nova/imgSample/bg_delete_sample.png';
import Convert2DTo3DIcon from '../../img/common/nova/imgSample/convert_2dto3d_smaple.gif';
import AIVideoIcon from '../../img/common/nova/imgSample/ico_ai_video.png';
import PerplexityIcon from '../../img/common/nova/imgSample/ico_perplexity.png';
import TranslationIcon from '../../img/common/nova/imgSample/ico_translation.png';
import VoiceDictationIcon from '../../img/common/nova/imgSample/ico_voice_dictation.png';
import ExpandImgIcon from '../../img/common/nova/imgSample/image_expand_sample.png';
import RemakeImgIcon from '../../img/common/nova/imgSample/image_remake_sample.png';
import ChangeStyleIcon from '../../img/common/nova/imgSample/image_style_sample.png';
import ImprovedResIcon from '../../img/common/nova/imgSample/image_upscaling_sample.png';
import StyleStudioIcon1 from '../../img/common/nova/imgSample/style_studio1.png';
import StyleStudioIcon2 from '../../img/common/nova/imgSample/style_studio2.png';
import StyleStudioIcon3 from '../../img/common/nova/imgSample/style_studio3.png';
import StyleStudioIcon4 from '../../img/common/nova/imgSample/style_studio4.png';
import ClaudeLogoDarkIcon from '../../img/dark/nova/logo/ico_claude_logo.svg';
import ClovaLogoDarkIcon from '../../img/dark/nova/logo/ico_clova_logo.svg';
import GPTLogoDarkIcon from '../../img/dark/nova/logo/ico_gpt_logo.svg';
import PerplexityLogoDarkIcon from '../../img/dark/nova/logo/ico_perplexity_logo.svg';
import ClaudeLogoLightIcon from '../../img/light/nova/logo/ico_claude_logo.svg';
import ClovaLogoLightIcon from '../../img/light/nova/logo/ico_clova_logo.svg';
import ExaoneLogoLightIcon from '../../img/light/nova/logo/ico_exaone_logo.svg';
import GPTLogoLightIcon from '../../img/light/nova/logo/ico_gpt_logo.svg';
import PerplexityLogoLightIcon from '../../img/light/nova/logo/ico_perplexity_logo.svg';
import SolarLogoLightIcon from '../../img/light/nova/logo/ico_solar_logo.svg';
import { NOVA_TAB_TYPE } from '../novaTapTypes';

export enum SERVICE_CATEGORY {
  CHAT = 'CHAT',
  TOOLS = 'TOOLS',
  IMAGE = 'IMAGE'
}

export enum SERVICE_TYPE {
  // Chat
  NOVA_CHAT_GPT4_1 = 'NOVA_CHAT_GPT4_1', // 5
  NOVA_IMG_GPT4_1 = 'NOVA_IMG_GPT4_1', // 10
  NOVA_ASK_DOC_GPT4_1 = 'NOVA_ASK_DOC_GPT4_1', // 10
  NOVA_CHAT_GPT4O_MINI = 'NOVA_CHAT_GPT4O_MINI', // 5
  NOVA_CHAT_O3MINI = 'NOVA_CHAT_O3MINI', // 2
  NOVA_CHAT_CLOVA = 'NOVA_CHAT_CLOVA', // 2
  NOVA_CHAT_CLAUDE3 = 'NOVA_CHAT_CLAUDE3', // 5
  NOVA_CHAT_CLAUDE_SONNET_4 = 'NOVA_CHAT_CLAUDE_SONNET_4', // 5
  NOVA_CHAT_GPT5 = 'NOVA_CHAT_GPT5',
  NOVA_IMG_GPT5 = 'NOVA_IMG_GPT5', // 10

  NOVA_CHAT_EXAONE_4_0 = 'NOVA_CHAT_EXAONE_4_0', // free
  NOVA_CHAT_SOLAR_PRO_2 = 'NOVA_CHAT_SOLAR_PRO_2', // free

  // Tools
  NOVA_WEBSEARCH_PERPLEXITY = 'NOVA_WEBSEARCH_PERPLEXITY', // 5
  NOVA_WEBSEARCH_SONAR_REASONING_PRO = 'NOVA_WEBSEARCH_SONAR_REASONING_PRO', // 10
  NOVA_TRANSLATION_DEEPL = 'NOVA_TRANSLATION_DEEPL', // 20
  NOVA_TRANSLATION_DEEPL_FILE = 'NOVA_TRANSLATION_DEEPL_FILE', // 100
  NOVA_SPEECH_RECOGNITION_CLOVA = 'NOVA_SPEECH_RECOGNITION_CLOVA', // 30
  NOVA_AI_AVATA_VIDEO_HEYGEN = 'NOVA_AI_AVATA_VIDEO_HEYGEN', // 10

  // Image
  NOVA_STYLE_STUDIO = 'NOVA_STYLE_STUDIO',
  NOVA_REMOVE_BG = 'NOVA_REMOVE_BG', // 10
  NOVA_PO_RESOLUTION = 'NOVA_PO_RESOLUTION', // 2
  NOVA_REPLACE_BG_CLIPDROP = 'NOVA_REPLACE_BG_CLIPDROP', // 10
  NOVA_REIMAGE_CLIPDROP = 'NOVA_REIMAGE_CLIPDROP', // 10
  NOVA_UNCROP_CLIPDROP = 'NOVA_UNCROP_CLIPDROP', // 10
  NOVA_PO_STYLE_TRANSFER = 'NOVA_PO_STYLE_TRANSFER', // 10
  NOVA_ANIMATION_3D_IMMERSITY = 'NOVA_ANIMATION_3D_IMMERSITY' // 10
}

export const TAB_SERVICE_MAP: Record<NOVA_TAB_TYPE, SERVICE_TYPE[]> = {
  [NOVA_TAB_TYPE.home]: [],

  // Chat
  [NOVA_TAB_TYPE.aiChat]: [
    SERVICE_TYPE.NOVA_CHAT_GPT4_1,
    SERVICE_TYPE.NOVA_IMG_GPT4_1,
    SERVICE_TYPE.NOVA_ASK_DOC_GPT4_1,
    SERVICE_TYPE.NOVA_CHAT_GPT4O_MINI,
    SERVICE_TYPE.NOVA_CHAT_O3MINI,
    SERVICE_TYPE.NOVA_CHAT_CLOVA,
    SERVICE_TYPE.NOVA_CHAT_CLAUDE3,
    SERVICE_TYPE.NOVA_CHAT_CLAUDE_SONNET_4,
    SERVICE_TYPE.NOVA_CHAT_GPT5,
    SERVICE_TYPE.NOVA_IMG_GPT5,
    SERVICE_TYPE.NOVA_CHAT_EXAONE_4_0,
    SERVICE_TYPE.NOVA_CHAT_SOLAR_PRO_2
  ],
  [NOVA_TAB_TYPE.perplexity]: [
    SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY,
    SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
  ],

  // Tools
  [NOVA_TAB_TYPE.translation]: [
    SERVICE_TYPE.NOVA_TRANSLATION_DEEPL,
    SERVICE_TYPE.NOVA_TRANSLATION_DEEPL_FILE
  ],
  [NOVA_TAB_TYPE.voiceDictation]: [SERVICE_TYPE.NOVA_SPEECH_RECOGNITION_CLOVA],
  [NOVA_TAB_TYPE.aiVideo]: [SERVICE_TYPE.NOVA_AI_AVATA_VIDEO_HEYGEN],

  // Image
  [NOVA_TAB_TYPE.styleStudio]: [SERVICE_TYPE.NOVA_STYLE_STUDIO],
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
      SERVICE_TYPE.NOVA_CHAT_GPT4_1,
      SERVICE_TYPE.NOVA_CHAT_GPT4O_MINI,
      SERVICE_TYPE.NOVA_CHAT_O3MINI,
      SERVICE_TYPE.NOVA_CHAT_CLOVA,
      SERVICE_TYPE.NOVA_CHAT_CLAUDE3,
      SERVICE_TYPE.NOVA_CHAT_CLAUDE_SONNET_4
    ],
    docImgQuery: [SERVICE_TYPE.NOVA_ASK_DOC_GPT4_1],
    imgGen: [SERVICE_TYPE.NOVA_IMG_GPT4_1]
  },
  [SERVICE_CATEGORY.TOOLS]: {
    perplexity: [
      SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY,
      SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
    ],
    translation: [SERVICE_TYPE.NOVA_TRANSLATION_DEEPL, SERVICE_TYPE.NOVA_TRANSLATION_DEEPL_FILE],
    voiceDictation: [SERVICE_TYPE.NOVA_SPEECH_RECOGNITION_CLOVA],
    aiVideo: [SERVICE_TYPE.NOVA_AI_AVATA_VIDEO_HEYGEN]
  },
  [SERVICE_CATEGORY.IMAGE]: {
    styleStudio: [SERVICE_TYPE.NOVA_STYLE_STUDIO],
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
  GPT_5: [SERVICE_TYPE.NOVA_CHAT_GPT5, SERVICE_TYPE.NOVA_IMG_GPT5],
  GPT_4_1: [
    SERVICE_TYPE.NOVA_CHAT_GPT4_1,
    SERVICE_TYPE.NOVA_ASK_DOC_GPT4_1,
    SERVICE_TYPE.NOVA_IMG_GPT4_1
  ],
  CLOVA_X: SERVICE_TYPE.NOVA_CHAT_CLOVA,
  EXAONE_4: SERVICE_TYPE.NOVA_CHAT_EXAONE_4_0,
  SOLAR_PRO_2: SERVICE_TYPE.NOVA_CHAT_SOLAR_PRO_2,

  PERPLEXITY_REASONING_PRO: SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO,
  CLAUDE_4: SERVICE_TYPE.NOVA_CHAT_CLAUDE_SONNET_4,
  CLAUDE_3_5: SERVICE_TYPE.NOVA_CHAT_CLAUDE3,
  GPT_4O_MINI: SERVICE_TYPE.NOVA_CHAT_GPT4O_MINI,
  PERPLEXITY: SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY,
  GPT_O3_MINI: SERVICE_TYPE.NOVA_CHAT_O3MINI
};

export const getChatGroupKey = (serviceType: SERVICE_TYPE): string => {
  const matchedKey = Object.keys(CHAT_GROUP_MAP).find((key) => {
    const value = CHAT_GROUP_MAP[key];
    return Array.isArray(value) ? value.includes(serviceType) : value === serviceType;
  });

  return matchedKey || 'UNKNOWN';
};

const CHAT_GROUP_DETAIL_MAP: Record<
  string,
  { label: string; icon: (isLightMode: boolean) => string }
> = {
  GPT_4_1: {
    label: 'GPT-4.1',
    icon: (isLightMode) => (isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon)
  },
  GPT_4O_MINI: {
    label: 'GPT-4o-mini',
    icon: (isLightMode) => (isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon)
  },
  GPT_O3_MINI: {
    label: 'GPT-O3-mini',
    icon: (isLightMode) => (isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon)
  },
  CLOVA_X: {
    label: 'NAVER CLOVA X',
    icon: (isLightMode) => (isLightMode ? ClovaLogoLightIcon : ClovaLogoDarkIcon)
  },
  EXAONE_4: {
    label: 'LG AI Research EXAONE 4.0',
    icon: (isLightMode) => (isLightMode ? ExaoneLogoLightIcon : ExaoneLogoLightIcon)
  },
  SOLAR_PRO_2: {
    label: 'Upstage Solar Pro 2',
    icon: (isLightMode) => (isLightMode ? SolarLogoLightIcon : SolarLogoLightIcon)
  },
  CLAUDE_3_5: {
    label: 'Claude 3.5 Sonnet',
    icon: (isLightMode) => (isLightMode ? ClaudeLogoLightIcon : ClaudeLogoDarkIcon)
  },
  CLAUDE_4: {
    label: 'Claude 4.0 Sonnet',
    icon: (isLightMode) => (isLightMode ? ClaudeLogoLightIcon : ClaudeLogoDarkIcon)
  },
  PERPLEXITY: {
    label: 'Perplexity',
    icon: (isLightMode) => (isLightMode ? PerplexityLogoLightIcon : PerplexityLogoDarkIcon)
  },
  PERPLEXITY_REASONING_PRO: {
    label: 'Perplexity RP',
    icon: (isLightMode) => (isLightMode ? PerplexityLogoLightIcon : PerplexityLogoDarkIcon)
  },
  GPT_5: {
    label: 'GPT-5',
    icon: (isLightMode) => (isLightMode ? GPTLogoLightIcon : GPTLogoDarkIcon)
  }
};

export const iconMap: Record<NOVA_TAB_TYPE, string[]> = {
  home: [],
  aiChat: [],
  perplexity: [PerplexityIcon],
  convert2DTo3D: [Convert2DTo3DIcon],
  styleStudio: [StyleStudioIcon1, StyleStudioIcon2, StyleStudioIcon3, StyleStudioIcon4],
  removeBG: [RemoveBGIcon],
  changeBG: [ChangeBGIcon],
  remakeImg: [RemakeImgIcon],
  expandImg: [ExpandImgIcon],
  improvedRes: [ImprovedResIcon],
  changeStyle: [ChangeStyleIcon],
  translation: [TranslationIcon],
  voiceDictation: [VoiceDictationIcon],
  aiVideo: [AIVideoIcon]
};

export const getServiceGroupInfo = (groupKey: string, isLightMode: boolean) => {
  const group = CHAT_GROUP_DETAIL_MAP[groupKey];

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

    const credits = (Array.isArray(services) ? services : [services]).map(
      (service) => serviceCredits[service]
    );
    const minCredit = Math.min(...credits);
    const maxCredit = Math.max(...credits);

    return {
      icon,
      key: Array.isArray(services) ? services[0] : services,
      title: label,
      desc: t(`Nova.ChatModel.${groupKey}.desc`),
      credit: Number.isFinite(minCredit)
        ? minCredit === maxCredit
          ? maxCredit.toString()
          : `${minCredit}~${maxCredit}`
        : '-1'
    };
  });
};

export const getServiceEngineName = (serviceType: SERVICE_TYPE): string => {
  const mapping: Partial<Record<SERVICE_TYPE, string>> = {
    [SERVICE_TYPE.NOVA_CHAT_GPT4_1]: 'gpt-4.1',
    [SERVICE_TYPE.NOVA_IMG_GPT4_1]: 'gpt-4.1',
    [SERVICE_TYPE.NOVA_ASK_DOC_GPT4_1]: 'gpt-4.1',
    [SERVICE_TYPE.NOVA_CHAT_GPT4O_MINI]: 'gpt-4o-mini',
    [SERVICE_TYPE.NOVA_CHAT_O3MINI]: 'o3-mini',
    [SERVICE_TYPE.NOVA_CHAT_CLAUDE3]: 'claude',
    [SERVICE_TYPE.NOVA_CHAT_CLAUDE_SONNET_4]: 'claude-sonnet-4',
    [SERVICE_TYPE.NOVA_CHAT_CLOVA]: 'clovax',
    [SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY]: 'sonar',
    [SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO]: 'sonar-reasoning-pro',
    [SERVICE_TYPE.NOVA_CHAT_EXAONE_4_0]: 'exaone-4.0',
    [SERVICE_TYPE.NOVA_CHAT_SOLAR_PRO_2]: 'solar-pro-2',
    [SERVICE_TYPE.NOVA_CHAT_GPT5]: 'gpt-5',
    [SERVICE_TYPE.NOVA_IMG_GPT5]: 'gpt-5'
  };

  return mapping[serviceType] || 'unknown';
};

export const findTabByService = (serviceType: SERVICE_TYPE): NOVA_TAB_TYPE => {
  return Object.entries(TAB_SERVICE_MAP).find(([, services]) =>
    services.includes(serviceType)
  )?.[0] as NOVA_TAB_TYPE;
};

export interface ServiceLoggingInfo {
  name: string;
  detail: string;
}
export const getServiceLoggingInfo = (serviceType: SERVICE_TYPE): ServiceLoggingInfo => {
  const mapping: Partial<Record<SERVICE_TYPE, ServiceLoggingInfo>> = {
    [SERVICE_TYPE.NOVA_CHAT_GPT5]: { name: 'nova_chating', detail: '5' },
    [SERVICE_TYPE.NOVA_CHAT_GPT4_1]: { name: 'nova_chating', detail: '4.1' },
    [SERVICE_TYPE.NOVA_IMG_GPT4_1]: { name: 'nova_chating', detail: '4.1' },
    [SERVICE_TYPE.NOVA_ASK_DOC_GPT4_1]: { name: 'nova_chating', detail: '4.1' },
    [SERVICE_TYPE.NOVA_CHAT_GPT4O_MINI]: { name: 'nova_chating', detail: '4o_mini' },
    [SERVICE_TYPE.NOVA_CHAT_O3MINI]: { name: 'nova_chating', detail: '3o_mini' },
    [SERVICE_TYPE.NOVA_CHAT_CLAUDE3]: { name: 'nova_chating', detail: 'claude3' },
    [SERVICE_TYPE.NOVA_CHAT_CLAUDE_SONNET_4]: { name: 'nova_chating', detail: 'claude4' },
    [SERVICE_TYPE.NOVA_CHAT_CLOVA]: { name: 'nova_chating', detail: 'clova' },
    [SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY]: { name: 'nova_web_search', detail: 'perplexity' },
    [SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO]: {
      name: 'nova_web_search',
      detail: 'perplexity_pro'
    },
    [SERVICE_TYPE.NOVA_STYLE_STUDIO]: { name: 'nova_style_studio', detail: 'image1' },
    [SERVICE_TYPE.NOVA_REMOVE_BG]: { name: 'nova_background_remove', detail: 'remove_bg' },
    [SERVICE_TYPE.NOVA_REPLACE_BG_CLIPDROP]: { name: 'nova_background_change', detail: 'clipdrop' },
    [SERVICE_TYPE.NOVA_REIMAGE_CLIPDROP]: { name: 'nova_image_remake', detail: 'clipdrop' },
    [SERVICE_TYPE.NOVA_UNCROP_CLIPDROP]: { name: 'nova_image_expansion', detail: 'clipdrop' },
    [SERVICE_TYPE.NOVA_PO_RESOLUTION]: {
      name: 'nova_resolution_elevation',
      detail: 'nova_po_resolution'
    },
    [SERVICE_TYPE.NOVA_PO_STYLE_TRANSFER]: {
      name: 'nova_style_change',
      detail: 'nova_po_style_transfer'
    },
    [SERVICE_TYPE.NOVA_ANIMATION_3D_IMMERSITY]: { name: 'nova_transform_3d', detail: 'immersity' },
    [SERVICE_TYPE.NOVA_SPEECH_RECOGNITION_CLOVA]: {
      name: 'nova_write_down',
      detail: 'clova_speech'
    },
    [SERVICE_TYPE.NOVA_AI_AVATA_VIDEO_HEYGEN]: {
      name: 'nova_video_create',
      detail: 'heygen'
    },
    [SERVICE_TYPE.NOVA_TRANSLATION_DEEPL]: {
      name: 'nova_translation',
      detail: 'deepl'
    },
    [SERVICE_TYPE.NOVA_TRANSLATION_DEEPL_FILE]: {
      name: 'nova_file_translation',
      detail: 'deepl'
    }
  };

  return mapping[serviceType] || { name: 'unknown', detail: 'unknown' };
};
