import styled from 'styled-components';
import { alignItemCenter, justiCenter } from '../style/cssCommon';

const Body = styled.div`
  width: 100%;
  height: 100%;
  ${justiCenter}
  ${alignItemCenter}
`;

const InvalidAccess = () => {
  return (
    <Body>
      <h1>{'Invalid access'}</h1>
    </Body>
  );
};

export default InvalidAccess;
