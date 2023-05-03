import styled, { CSSProp } from 'styled-components';

const TextAreaWrapper = styled.textarea<{ cssExt: any }>`
  resize: none;
  outline: none;

  ${({ cssExt }: any) => cssExt && cssExt}
`;

interface TextAreaProps {
  value: string | number;
  onChange: Function;
  onKeyUp?: React.KeyboardEventHandler;
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
  onKeyUp,
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
      onChange={(e) => onChange(e)}
      onKeyUp={onKeyUp}
      rows={rows}
      disabled={disable}
    />
  );
};

export default TextArea;
