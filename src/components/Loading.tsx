import styled, { CSSProp, css } from 'styled-components';
// import ai_loading from '../img/ai_motion_mid_56.webp';
import ai_loading from '../img/ezgif.com-gif-maker.png';
import Icon from './Icon';
import { alignItemCenter, flex, flexColumn, justiCenter } from '../style/cssCommon';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 13px;
  font-weight: 500;

  ${flex}
  ${flexColumn}
  ${justiCenter}
  ${alignItemCenter}
  
  color: var(--ai-purple-50-main);
  word-break: keep-all;
  text-align: center;
`;

const Contents = styled.div`
  width: 196px;
  text-align: center;
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
        imgCssExt={css`
          width: 56px;
          height: 56px;
        `}
      />
      <Contents>{children}</Contents>
    </Wrapper>
  );
};

export default Loading;
