import styled from 'styled-components';
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
  gap: 8px;
`;

const Contents = styled.div`
  width: 196px;
  display: flex;
  justify-content: center;
`;

const Loading = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Wrapper>
      <Icon iconSrc={ai_loading} size={56} />
      <Contents>{children}</Contents>
    </Wrapper>
  );
};

export default Loading;
