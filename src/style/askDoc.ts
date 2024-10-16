import styled from 'styled-components';

import { flex, flexColumn, justiSpaceBetween, TableCss } from './cssCommon';

export const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

export const WrapperPage = styled.div`
  ${flex};
  ${flexColumn};

  width: 100%;
  height: 100%;
`;

export const Wrapper = styled.div<{ background: boolean }>`
  ${flex};
  ${flexColumn};
  ${justiSpaceBetween};

  width: 100%;
  height: 100%;
  background-color: ${(props) => (props.background ? 'var(--ai-purple-99-bg-light)' : 'none')};

  ${TableCss}
`;

export const Footer = styled.div`
  position: relative;
  display: flex;
  padding: 0 24px 24px;
`;

export const GuideMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 40px;
  padding: 0 24px;

  h1 {
    font-size: 21px;
    font-weight: bold;
    line-height: 32px;
    text-align: left;
    white-space: pre-line;
    margin: 0;
    color: #26282b;
  }

  p {
    height: 21px;
    font-size: 14px;
    line-height: 21px;
    text-align: left;
    color: #454c53;

    b {
      color: #6f3ad0;
    }
  }
`;
