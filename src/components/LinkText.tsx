import styled from 'styled-components';

import { openNewWindow } from '../util/common';

const LinkTextWrapper = styled.div`
  display: flex;
  color: black;
  cursor: pointer;
  width: fit-content;
  justify-content: flex-end;
`;

interface LinkTextProps {
  url: string;
  children?: React.ReactNode;
}

const LinkText = ({ url, children }: LinkTextProps) => {
  return (
    <LinkTextWrapper
      onClick={() => {
        openNewWindow(url);
      }}>
      {children}
    </LinkTextWrapper>
  );
};

export default LinkText;
