import styled from 'styled-components';
import { flex } from '../style/cssCommon';

const LinkTextWrapper = styled.div`
  ${flex}
  color: black;
  cursor: pointer;
  width: fit-content;
`;

interface LinkTextProps {
  url: string;
  children?: React.ReactNode;
}

const LinkText = ({ url, children }: LinkTextProps) => {
  const handleOpenNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener, noreferrer');
  };

  return <LinkTextWrapper onClick={() => handleOpenNewTab(url)}>{children}</LinkTextWrapper>;
};

export default LinkText;
