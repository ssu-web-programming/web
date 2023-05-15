import styled, { CSSProp } from 'styled-components';

const TextAreaWrapper = styled.textarea<{ cssExt: any }>`
  resize: none;
  outline: none;
  ::placeholder {
    font-size: 13px;
    color: var(--gray-gray-60-03);
  }

  ${({ cssExt }: any) => cssExt && cssExt}
`;

interface TextAreaProps {
  value: string | number;
  onChange?: Function;
  onKeyDown?: Function;
  cssExt?: CSSProp<any>;
  rows?: number;
  textRef?: React.RefObject<HTMLTextAreaElement> | null;
  disable?: boolean;
  onBlur?: Function;
  placeholder?: string;
}

const TextArea = ({
  value,
  onChange,
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
