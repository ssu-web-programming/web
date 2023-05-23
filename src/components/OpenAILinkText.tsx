import Icon from './Icon';
import LinkText from './LinkText';
import icon_openai from '../img/logo_open_ai.svg';
import styled, { css } from 'styled-components';
import { flex, justiEnd } from '../style/cssCommon';

const Wrapper = styled.div`
  ${flex}

  font-family: Pretendard;
  font-size: 11px;
  font-weight: 500;
  color: #8769ba;
  outline: none;
  margin-right: 3px;
`;

const OPEN_API_LINK =
  'https://polarisofficehelp.zendesk.com/hc/ko/sections/6735266225039-Polaris-Office-AI-Usage-policy';

const OpenAILinkText = () => {
  return (
    <LinkText url={OPEN_API_LINK}>
      <Wrapper>Powered By</Wrapper>
      <Icon
        cssExt={css`
          width: 57px;
          /* height: 14px; */
        `}
        iconSrc={icon_openai}
      />
    </LinkText>
  );
};

export default OpenAILinkText;
