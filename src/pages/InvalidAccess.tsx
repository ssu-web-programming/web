import styled from 'styled-components';

const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InvalidAccess = () => {
  return (
    <Body>
      <h1>{'Invalid access'}</h1>
    </Body>
  );
};

export default InvalidAccess;
