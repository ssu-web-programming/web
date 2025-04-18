import DarkLogo from '../img/dark/nova/ico_logo_nova_with_text.svg';
import LightLogo from '../img/light/nova/ico_logo_nova_with_text.svg';
import { ThemeType } from '../store/slices/theme';

export const lightTheme = {
  mode: 'light',
  color: {
    background: {
      bg: 'var(--gray-gray-10)',
      gray01: 'var(--white)',
      gray02: 'var(--gray-gray-20)',
      gray03: 'var(--white)',
      gray04: 'var(--gray-gray-10)',
      gray05: 'var(--white)',
      gray06: 'var(--gray-gray-20)',
      gray07: 'var(--gray-gray-30)',
      gray08: 'var(--gray-gray-87)',
      gray09: 'var(--ai-purple-97-list-over)',
      gray10: 'var(--gray-gray-10)',
      gray11: 'var(--gray-gray-20)',
      gray12: 'var(--gray-gray-15)',
      gray13: 'var(--gray-gray-22)',
      gray14: 'var(--white)',
      gray15: 'var(--gray-gray-40)',
      yellow01: 'var(--yellow-yellow-95)',
      yellow02: 'var(--yellow-yellow-95)',
      purple01: 'var(--ai-purple-50-main)',
      mainBg: 'var(--ai-purple-99-bg-light)',
      selected: 'var(--ai-purple-97-list-over)',
      dimBg: 'var(--white-alpha)',
      deepNavy: 'var(--deep-navy)',
      tooltip: 'var(--gray-gray-89-alpha)'
    },
    border: {
      gray01: 'var(--gray-gray-40)',
      gray02: 'var(--gray-gray-30)',
      gray03: 'var(--gray-gray-40)',
      gray04: 'var(--gray-gray-12)',
      gray05: 'var(--gray-gray-30)',
      gray06: 'var(--gray-gray-30)',
      purple01: 'var(--ai-purple-90)',
      purple02: 'var(--ai-purple-50-main)'
    },
    main: 'var(--ai-purple-50-main)',
    tab: {
      border: 'var(--gray-gray-40)',
      highlightBorder: 'var(--ai-purple-90)',
      bg: 'var(--white)',
      highlightBg: 'var(--ai-purple-97-list-over)',
      text: 'var(--gray-gray-90-01)',
      highlight: 'var(--ai-purple-45)'
    },
    text: {
      main: 'var(--ai-purple-50-main)',
      main02: 'var(--ai-purple-50-main)',
      gray01: 'var(--gray-gray-60-03)',
      gray02: 'var(--gray-gray-60-03)',
      gray03: 'var(--gray-gray-80-02)',
      gray04: 'var(--gray-gray-90-01)',
      gray05: 'var(--gray-gray-80-02)',
      gray06: 'var(--gray-gray-70)',
      gray07: 'var(--gray-gray-60-03)',
      gray08: 'var(--gray-gray-60-03)',
      gray09: 'var(--gray-gray-70)',
      gray10: 'var(--gray-gray-80-02)',
      gray11: 'var(--white)',
      highlight01: 'var(--ai-purple-45)',
      highlight02: 'var(--gray-gray-80-02)',
      highlight03: 'var(--ai-purple-50-main )',
      highlight04: 'var(--white)'
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
    background: {
      bg: 'var(--gray-gray-85)',
      gray01: 'var(--gray-gray-90)',
      gray02: 'var(--gray-gray-87)',
      gray03: 'var(--gray-gray-87)',
      gray04: 'var(--gray-gray-90)',
      gray05: 'var(--gray-gray-85)',
      gray06: 'var(--gray-gray-90)',
      gray07: 'var(--gray-gray-90)',
      gray08: 'var(--gray-gray-89)',
      gray09: 'var(--ai-purple-30)',
      gray10: 'var(--gray-gray-87)',
      gray11: 'var(--gray-gray-85)',
      gray12: 'var(--gray-gray-87)',
      gray13: 'var(--gray-gray-35)',
      gray14: 'var(--gray-gray-90-01)',
      gray15: 'var(--gray-gray-87)',
      yellow01: 'var(--gray-gray-85)',
      yellow02: 'var(--gray-gray-90)',
      purple01: 'var(--ai-purple-90)',
      mainBg: 'var(--ai-purple-50-main-alpha)',
      selected: 'var(--ai-purple-50-main-alpha)',
      dimBg: 'var(--black-alpha)',
      deepNavy: 'var(--gray-gray-25)',
      tooltip: 'var(--gary-gray-62-alpha)'
    },
    border: {
      gray01: 'var(--gray-gray-35)',
      gray02: 'var(--gray-gray-87)',
      gray03: 'var(--gray-gray-87)',
      gray04: 'var(--gray-gray-87)',
      gray05: 'var(--gray-gray-35)',
      gray06: 'var(--gray-gray-90)',
      purple01: 'var(--ai-purple-80-sub)',
      purple02: 'var(--ai-purple-90)'
    },
    main: 'var(--ai-purple-50-main)',
    tab: {
      border: 'var(--gray-gray-35)',
      highlightBorder: 'var(--ai-purple-40)',
      bg: 'var(--gray-gray-90)',
      highlightBg: 'var(--ai-purple-50-main-alpha)',
      text: 'var(--gray-gray-25)',
      highlight: 'var(--ai-purple-90)'
    },
    text: {
      main: 'var(--ai-purple-90)',
      main02: 'var(--gray-gray-25)',
      gray01: 'var(--gray-gray-65)',
      gray02: 'var(--gray-gray-25)',
      gray03: 'var(--gray-gray-25)',
      gray04: 'var(--gray-gray-25)',
      gray05: 'var(--gray-gray-60)',
      gray06: 'var(--gray-gray-25)',
      gray07: 'var(--gray-gray-60)',
      gray08: 'var(--gray-gray-35)',
      gray09: 'var(--gray-gray-60)',
      gray10: 'var(--gray-gray-65)',
      gray11: 'var(--gray-gray-25)',
      highlight01: 'var(--ai-purple-90)',
      highlight02: 'var(--ai-purple-90)',
      highlight03: 'var(--ai-purple-90)',
      highlight04: 'var(--ai-purple-50-main)'
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
  if (process.env.NODE_ENV == 'development') {
    return theme == ThemeType.light ? lightTheme : darkTheme;
  }
  return theme == ThemeType.light ? lightTheme : darkTheme;
};
