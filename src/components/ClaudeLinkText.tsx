import LinkText from './LinkText';
import icon_claude from '../img/logo_anthropic.svg';
import styled from 'styled-components';
import { flex } from '../style/cssCommon';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  ${flex}

  font-family: Pretendard;
  font-size: 11px;
  font-weight: 500;
  color: #8769ba;
  outline: none;
  margin-right: 3px;
`;

const ClaudeLinkText = () => {
  const { t } = useTranslation();

  return (
    <LinkText url={t(`MoveToLimitInfo`)}>
      <Wrapper>Powered By</Wrapper>
      <img src={icon_claude} alt="Claude" />
    </LinkText>
  );
};

export default ClaudeLinkText;
