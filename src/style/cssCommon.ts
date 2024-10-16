import { css } from 'styled-components';

export const userSelectCss = css`
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
`;

export const flexColumn = css`
  -webkit-box-orient: vertical;
  -ms-flex-direction: column;
  flex-direction: column;
`;

export const flexWrap = css`
  -webkit-box-lines: multiple;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;

export const justiSpaceBetween = css`
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
`;

export const justiSpaceAround = css`
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-around;
`;

export const justiStart = css`
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
`;

export const justiCenter = css`
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
`;

export const justiEnd = css`
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
`;

export const alignItemStart = css`
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
`;

export const alignItemCenter = css`
  /* [정렬] 교차축 - 가운데 기준 */
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
`;

export const alignItemEnd = css`
  // 플렉스 컨테이너에 적용. 아이템 교차축 end 정렬.
  -webkit-box-align: end;
  -ms-flex-align: end;
  align-items: flex-end;
`;

export const flexGrow = css`
  /* 확장 지수 설정 */
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex-grow: 1;

  /* 아이템 정렬 순서 (Android 2.1~4.3 이하 지원 X)
  -webkit-box-ordinal-group: 1;
  -ms-flex-order: 1;
  order: 1; */
`;

export const flexShrink = css`
  -webkit-flex: 1;
  flex-shrink: 1;
`;

export const grid = css`
  display: grid;
`;
