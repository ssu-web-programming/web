import DarkLogo from '../img/dark/nova/ico_logo_nova.svg';
import LightLogo from '../img/light/nova/ico_logo_nova.svg';
import { ThemeType } from '../store/slices/theme';
import { ClientType, getPlatform } from '../util/bridge';

export const lightTheme = {
  mode: 'light',
  color: {
    bg: 'var(--gray-gray-10)',
    subBgGray01: 'var(--white)',
    subBgGray02: 'var(--gray-gray-20)',
    subBgGray03: 'var(--white)',
    subBgGray04: 'var(--gray-gray-10)',
    subBgGray05: 'var(--white)',
    subBgGray06: 'var(--gray-gray-20)',
    subBgGray07: 'var(--gray-gray-30)',
    subBgGray08: 'var(--gray-gray-87)',
    mainBg: 'var(--ai-purple-99-bg-light)',
    dimBg: 'var(--white-alpha)',
    borderGray01: 'var(--gray-gray-40)',
    borderGray02: 'var(--gray-gray-30)',
    borderGray03: 'var(--gray-gray-40)',
    borderPurple01: 'var(--ai-purple-90)',
    main: 'var(--ai-purple-50-main)',
    tab: {
      border: 'var(--gray-gray-40)',
      highlightBorder: 'var(--ai-purple-90)',
      bg: 'var(--white)',
      highlightBg: 'var(--ai-purple-97-list-over)',
      text: 'var(--gray-gray-90-01)',
      highlightText: 'var(--ai-purple-45)'
    },
    text: {
      main: 'var(--ai-purple-50-main)',
      main02: 'var(--ai-purple-50-main)',
      subGray01: 'var(--gray-gray-60-03)',
      subGray02: 'var(--gray-gray-60-03)',
      subGray03: 'var(--gray-gray-80-02)',
      subGray04: 'var(--gray-gray-90-01)',
      subGray05: 'var(--gray-gray-80-02)',
      subGray06: 'var(--gray-gray-70)',
      subGray07: 'var(--gray-gray-60-03)',
      subGray08: 'var(--gray-gray-60-03)',
      highlightText: 'var(--ai-purple-45)',
      highlightText02: 'var(--gray-gray-80-02)'
    },
    toast: {
      success: {
        bg: 'var(--primary-po-green-10)',
        border: 'var(--primary-po-green-40)',
        text: 'var(--primary-po-green-60)'
      },
      error: {
        bg: 'var(--primary-po-red-30)',
        border: 'var(--primary-po-red-40)',
        text: 'var(--primary-po-red-60)'
      }
    }
  },
  img: {
    logo: LightLogo
  }
};

export const darkTheme = {
  mode: 'dark',
  color: {
    bg: 'var(--gray-gray-85)',
    subBgGray01: 'var(--gray-gray-90)',
    subBgGray02: 'var(--gray-gray-87)',
    subBgGray03: 'var(--gray-gray-87)',
    subBgGray04: 'var(--gray-gray-90)',
    subBgGray05: 'var(--gray-gray-85)',
    subBgGray06: 'var(--gray-gray-90)',
    subBgGray07: 'var(--gray-gray-90)',
    subBgGray08: 'var(--gray-gray-89)',
    mainBg: 'var(--ai-purple-50-main-alpha)',
    dimBg: 'var(--black-alpha)',
    borderGray01: 'var(--gray-gray-35)',
    borderGray02: 'var(--gray-gray-87)',
    borderGray03: 'var(--gray-gray-87)',
    borderPurple01: 'var(--ai-purple-80-sub)',
    main: 'var(--ai-purple-50-main)',
    tab: {
      border: 'var(--gray-gray-35)',
      highlightBorder: 'var(--ai-purple-40)',
      bg: 'var(--gray-gray-90)',
      highlightBg: 'var(--ai-purple-50-main-alpha)',
      text: 'var(--gray-gray-25)',
      highlightText: 'var(--ai-purple-90)'
    },
    text: {
      main: 'var(--ai-purple-90)',
      main02: 'var(--gray-gray-25)',
      subGray01: 'var(--gray-gray-65)',
      subGray02: 'var(--gray-gray-25)',
      subGray03: 'var(--gray-gray-25)',
      subGray04: 'var(--gray-gray-25)',
      subGray05: 'var(--gray-gray-60)',
      subGray06: 'var(--gray-gray-25)',
      subGray07: 'var(--gray-gray-60)',
      subGray08: 'var(--gray-gray-35)',
      highlightText: 'var(--ai-purple-90)',
      highlightText02: 'var(--ai-purple-90)'
    },
    toast: {
      success: {
        bg: 'var(--primary-po-green-90)',
        border: 'var(--primary-po-green-80)',
        text: 'var(--white-alpha)'
      },
      error: {
        bg: 'var(--primary-po-red-80)',
        border: 'var(--primary-po-red-80)',
        text: 'var(--white-alpha)'
      }
    }
  },
  img: {
    logo: DarkLogo
  }
};

export const selectTheme = (theme: ThemeType) => {
  const platform = getPlatform();
  if (
    platform === ClientType.mac ||
    platform === ClientType.web ||
    platform === ClientType.unknown
  ) {
    return theme == ThemeType.light ? lightTheme : darkTheme;
  } else {
    return lightTheme;
  }
};
