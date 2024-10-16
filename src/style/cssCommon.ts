import { css } from 'styled-components';

export const userSelectCss = css`
  user-drag: none;
  touch-callout: none;
  user-select: none;
`;

export const CustomScrollbar = css`
  scrollbar-color: #c9cdd2 #ffffff;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
    background: #ffffff;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #c9cdd2;
  }

  &::-webkit-scrollbar-track {
    border-radius: 4px;
    background: #ffffff;
  }
`;

export const TableCss = css`
  table {
    border-collapse: collapse;
    border-radius: 6px;
  }

  th,
  td {
    padding: 0.5em 1em;
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

export const flex = css`
  display: flex;
`;

export const flexColumn = css`
  flex-direction: column;
`;

export const flexWrap = css`
  flex-wrap: wrap;
`;

export const justiSpaceBetween = css`
  justify-content: space-between;
`;

export const justiSpaceAround = css`
  justify-content: space-around;
`;

export const justiStart = css`
  justify-content: flex-start;
`;

export const justiCenter = css`
  justify-content: center;
`;

export const justiEnd = css`
  justify-content: flex-end;
`;

export const alignItemStart = css`
  align-items: flex-start;
`;

export const alignItemCenter = css`
  align-items: center;
`;

export const alignItemEnd = css`
  align-items: flex-end;
`;

export const flexGrow = css`
  flex-grow: 1;
`;

export const flexShrink = css`
  flex-shrink: 1;
`;

export const grid = css`
  display: grid;
`;
