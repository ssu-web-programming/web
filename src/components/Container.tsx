import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Container({ children }: { children: React.ReactNode }) {
  return <Wrap>{children}</Wrap>;
}
