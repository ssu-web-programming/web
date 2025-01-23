import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }: { theme: any }) => theme.color.background.gray11};
    font-family: 'Pretendard', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    font-weight: 500;
  }

  html, body, #root, div, textarea {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }: { theme: any }) => theme.color.border.gray01} transparent;

    &::-webkit-scrollbar {
      width: 6px;
      background: #ffffff;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 14px;
    }

    &::-webkit-scrollbar-track {
      background: #ffffff;
      border-radius: 14px;
    }
  }

  img {
    -webkit-user-drag: none;
  }

  :root {
    --ai-purple-30: #3e0f8d;
    --ai-purple-40: #602bc1;
    --ai-purple-45: #511bb2;
    --ai-purple-50-main: #6f3ad0;
    --ai-purple-50-main-alpha: rgba(111, 58, 208, 0.3);
    --ai-purple-70: #8a56ea;
    --ai-purple-80-sub: #9d75ec;
    --ai-purple-90: #c6a9ff;
    --ai-purple-95-list-pressed: #e0d1ff;
    --ai-purple-97-list-over: #ede5fe;
    --ai-purple-99-bg-light: #f5f1fd;

    --black: #000000;
    --black-alpha: rgba(0, 0, 0, 0.3);
    --gray-gray-90-01: #26282b;
    --gray-gray-90: #2d2d2d;
    --gray-gray-89: #262626;
    --gray-gray-87: #3b3b3b;
    --gray-gray-85: #282828;
    --gray-gray-80-02: #454c53;
    --gray-gray-70: #72787f;
    --gray-gray-65: #797979;
    --gray-gray-60-03: #9ea4aa;
    --gray-gray-60: #9e9e9e;
    --gray-gray-50: #b3b8bd;
    --gray-gray-40: #C9CDD2;
    --gray-gray-30: #E8EBED;
    --gray-gray-35: #595959;
    --gray-gray-25: #d8d8d8;
    --gray-gray-20: #f2f4f6;
    --gray-gray-10: #f7f8f9;
    --white: #ffffff;
    --white-alpha: rgba(255, 255, 255, 0.7);

    --gray-shadow-light: rgba(38, 40, 43, 0.05);

    --sale: #fb4949;

    --primary-po-red-30: #FEEEEE;
    --primary-po-red-40: #FA8C8C;
    --primary-po-red-50: #F95C5C;
    --primary-po-red-60: #D34E4E;
    --primary-po-red-70: #FB4949;
    --primary-po-red-80: #632424;

    --primary-po-green-10: #EDF7E8;
    --primary-po-green-40: #85CA5F;
    --primary-po-green-50: #51B41B;
    --primary-po-green-60: #449916;
    --primary-po-green-90: #20480A;

    --primary-po-blue-40: #60A5FA;
    --primary-po-blue-50: #1D7FF9;
    --primary-po-blue-60: #186CD3;
  }

  textarea, button, pre {
    font-family: 'Pretendard', sans-serif;
  }

  pre {
    white-space: pre-wrap;
  }

  ol, ul {
    display: grid;
    flex-direction: column;

    margin: 0;
    padding-left: 25px;
    margin-block-start: 0;
    margin-block-end: 0;
    height: fit-content;

    li {
      ::marker {
      }
    }
  }

  p {
    /* css reset */
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;

    line-height: 160%;
  }

  html, * {
    box-sizing: border-box;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    border: none;
  }

  hr {
    width: inherit;
    border: revert;
  }

`;

export default GlobalStyle;
