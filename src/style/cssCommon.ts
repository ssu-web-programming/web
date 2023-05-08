import { css } from 'styled-components';

export const userSelectCss = css`
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const purpleBtnCss = css`
  background-image: linear-gradient(to left, #a86cea, var(--ai-purple-50-main));
  color: #fff;
`;

export const TableCss = css`
  table {
    border-collapse: collapse;
    border-radius: 6px;
  }

  th,
  td {
    padding: 1em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }

  table,
  tr,
  td,
  th {
    border-radius: 6px;
    border: 1px solid #555;
  }

  textarea:focus {
    outline: none;
  }

  input:focus {
    outline: none;
  }
`;
