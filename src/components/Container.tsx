import styled from 'styled-components';
import { alignItemCenter, justiCenter } from '../style/cssCommon';

const Wrap = styled.div`
  ${justiCenter}
  ${alignItemCenter}
`;

export default function Container({ children }: { children: React.ReactNode }) {
  return <Wrap>{children}</Wrap>;
}
