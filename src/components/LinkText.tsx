import styled from 'styled-components';
import { flex, justiEnd } from '../style/cssCommon';
import { openNewWindow } from '../util/common';

const LinkTextWrapper = styled.div`
  ${flex}
  color: black;
  cursor: pointer;
  width: fit-content;
  ${justiEnd}
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
