import styled, { FlattenSimpleInterpolation } from 'styled-components';
import { alignItemCenter, flex } from '../style/cssCommon';

const TextAreaWrapper = styled.textarea<{ cssExt?: FlattenSimpleInterpolation }>`
  resize: none;
  outline: none;
  ::placeholder {
    ${flex}
    ${alignItemCenter}
    font-size: 13px;
    color: var(--gray-gray-60-03);
  }
  font-size: 13px;

  ${({ cssExt }) => cssExt && cssExt}
`;

interface TextAreaProps {
  value: string | number;
  onChange?: Function;
  onClick?: Function;
  onKeyDown?: Function;
  cssExt?: FlattenSimpleInterpolation;
  rows?: number;
  textRef?: React.RefObject<HTMLTextAreaElement> | null;
  disable?: boolean;
  onBlur?: Function;
  placeholder?: string;
}

const TextArea = ({
  value,
  onChange,
  onClick,
  onKeyDown,
  cssExt,
  rows = 5,
  textRef,
  disable = false,
  onBlur,
  placeholder
}: TextAreaProps) => {
  return (
    <TextAreaWrapper
      onClick={(e) => onClick && onClick(e)}
      placeholder={placeholder}
      onBlur={() => {
        onBlur && onBlur();
      }}
      ref={textRef}
      cssExt={cssExt}
      value={value}
      onChange={(e) => onChange && onChange(e)}
      onKeyDown={(e) => onKeyDown && onKeyDown(e)}
      rows={rows}
      disabled={disable}
    />
  );
};

export default TextArea;
