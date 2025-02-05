import { ReactNode } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  /* padding: 24px 16px; */
  flex: 1 1 0;
  overflow-y: auto;
  background: ${({ theme }) => theme.color.background.bg};
  color: ${({ theme }) => theme.color.text.subGray05};
`;

interface Props {
  children: ReactNode;
}

export default function BgContainer({ children }: Props) {
  return (
    <Wrap>
      <Container>{children}</Container>
    </Wrap>
  );
}
