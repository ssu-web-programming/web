import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
html,
    body,
    #root {
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    scrollbar-color: #ebebeb #ffffff;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      opacity: 0.2;
        background-color: #000;

      &:hover {
       opacity: 0.4;
      }
    }
    &::-webkit-scrollbar-track {
      background: #ffffff;
    }
  }
  
  img{
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }

  :root {
    --ai-purple-50-main: #6f3ad0;
    --ai-purple-70: #8a56ea;
    --ai-purple-80-sub: #9d75ec;
    --ai-purple-90: #c6a9ff;
    --ai-purple-95-list-pressed: #e0d1ff;
    --ai-purple-97-list-over: #ede5fe;
    --ai-purple-99-bg-light: #f5f1fd;

    --gray-gray-90-01: #26282b;
    --gray-gray-80-02: #454c53;
    --gray-gray-70: #72787f;
    --gray-gray-60-03: #9ea4aa;
    --gray-gray-50: #b3b8bd;
    --gray-gray-20: #f2f4f6;

    --sale: #fb4949;
    --primary-po-green-60: #449916;
  }

  textarea, button, pre{
        font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }
`;

export default GlobalStyle;
