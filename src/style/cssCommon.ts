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
  border: none;
  box-shadow: none;
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

export const flex = css`
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
`;

export const flexColumn = css`
  ${flex}
  -webkit-box-orient: vertical;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
`;

export const flexWrap = css`
  ${flex}

  -webkit-box-lines: multiple;
  -moz-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;

export const justiSpaceBetween = css`
  ${flex}
  -webkit-box-pack: justify;
  -moz-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
`;

export const justiSpaceAround = css`
  ${flex}
  -webkit-box-pack: justify;
  -moz-justify-content: space-around;
  -ms-flex-pack: justify;
  justify-content: space-around;
`;

export const justiStart = css`
  ${flex}
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
`;

export const justiCenter = css`
  ${flex}
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
`;

export const justiEnd = css`
  ${flex}
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
`;

export const alignItemStart = css`
  ${flex}
  -webkit-box-align: start;
  -moz-align-items: start;
  -ms-flex-align: start;
  align-items: flex-start;
`;

export const alignItemCenter = css`
  ${flex}
  /* [정렬] 교차축 - 가운데 기준 */
  -webkit-box-align: center;
  -moz-align-items: center;
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
  display: -webkit-grid;
  display: grid;
`;

export const grid3Btn = css`
  ${grid}

  -webkit-grid-columns: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
`;
