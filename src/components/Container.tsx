import styled from 'styled-components';
import { alignItemCenter, flex, justiCenter } from '../style/cssCommon';

const Wrap = styled.div`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}
`;

export default function Container({ children }: { children: React.ReactNode }) {
  return <Wrap>{children}</Wrap>;
}
