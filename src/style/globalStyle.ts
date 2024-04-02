import { createGlobalStyle } from 'styled-components';
import { flex, flexColumn } from './cssCommon';

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
  }

  html, body, #root, div, textarea{
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.2);

      &:hover {
       background-color: rgba(0, 0, 0, 0.4);
       cursor: pointer;
      }
    }
    &::-webkit-scrollbar-track {
      background: transparent;
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

  pre {
    white-space: pre-wrap;
  }

  ol, ul{
    ${flex}
    ${flexColumn}

    margin: 0;
    padding-left: 20px;
    margin-block-start: 0px;
    margin-block-end: 0px;
    height: fit-content;

    li{
      ::marker{
      }
    }
  }

  li{
    margin-block-end: 8px;
  }
      
  p{
    /* css reset */
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;

    line-height: 160%;
  }  

  html, *{
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
