import styled, { css } from 'styled-components';

export const LengthWrapper = styled.div<{ isError?: boolean }>`
  display: flex;
  align-items: center;

  font-size: 12px;
  color: var(--gray-gray-70);

  ${({ isError }) =>
    isError !== undefined &&
    css`
      color: ${isError ? 'var(--sale)' : 'var(--gray-gray-70)'};
    `}
`;

interface TextLengthProps {
  length: number;
  max: number;
}

export default function TextLength(props: TextLengthProps) {
  const { length, max } = props;
  return (
    <LengthWrapper isError={length >= max}>
      {length}/{max}
    </LengthWrapper>
  );
}

export const BoldTextLength = styled(LengthWrapper)`
  font-weight: 500;
`;
