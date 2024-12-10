import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import icon_openai from '../img/light/logo_open_ai.svg';

import LinkText from './LinkText';

const Wrapper = styled.div`
  display: flex;

  font-family: Pretendard;
  font-size: 11px;
  font-weight: 500;
  color: #8769ba;
  outline: none;
  margin-right: 3px;
`;

const OpenAILinkText = () => {
  const { t } = useTranslation();

  return (
    <LinkText url={t(`MoveToLimitInfo`)}>
      <Wrapper>Powered By</Wrapper>
      <img src={icon_openai} alt="Open AI" />
    </LinkText>
  );
};

export default OpenAILinkText;
