import Icon from './Icon';
import LinkText from './LinkText';
import icon_openai from '../img/logo_open_ai.svg';
import styled, { css } from 'styled-components';
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

const OpenAILinkText = () => {
  const { t } = useTranslation();

  return (
    <LinkText url={t(`MoveToLimitInfo`)}>
      <Wrapper>Powered By</Wrapper>
      <Icon
        cssExt={css`
          width: 59px;
          height: 16px;
        `}
        iconSrc={icon_openai}
      />
    </LinkText>
  );
};

export default OpenAILinkText;
