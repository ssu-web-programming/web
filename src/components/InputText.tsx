import styled, { css } from 'styled-components';

const DEFAULT_SIZE = 200;

const Body = styled.input<{ size: number }>`
  ${({ size }) => css`
    width: ${size}px;
  `}
  height: 50px;
  &:focus {
    outline: none;
  }
`;

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: number;
  placeholder?: string;
}

export default function InputText(props: InputProps) {
  const { value, onChange, size, placeholder } = props;
  return (
    <Body
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder ? placeholder : undefined}
      size={size || DEFAULT_SIZE}></Body>
  );
}
