import styled, { CSSProp, css } from 'styled-components';
import ai_loading from '../img/ai_motion_mid_56.webp';
import Icon from './Icon';
import { alignItemCenter, flexColumn, justiCenter } from '../style/cssCommon';

const Wrapper = styled.div`
  ${flexColumn}
  ${justiCenter}
  ${alignItemCenter}
  
  color: var(--ai-purple-50-main);
  word-wrap: break-word;
  text-align: center;
  font-size: 13px;
`;

const Loading = ({ children, cssExt }: { children?: React.ReactNode; cssExt?: CSSProp }) => {
  return (
    <Wrapper>
      <Icon
        iconSrc={ai_loading}
        cssExt={css`
          margin-bottom: 8px;
          ${cssExt}
        `}
      />
      {children}
    </Wrapper>
  );
};

export default Loading;
