import styled from 'styled-components';
import { flex, justiEnd } from '../style/cssCommon';
import { getLangCodeFromParams } from '../locale';

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
  const handleOpenNewTab = (url: string) => {
    window._Bridge.openWindow(url);
  };

  return <LinkTextWrapper onClick={() => handleOpenNewTab(url)}>{children}</LinkTextWrapper>;
};

export default LinkText;
