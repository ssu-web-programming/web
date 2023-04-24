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
  ref?: any;
  disable?: boolean;
}

const TextArea = ({
  value,
  onChange,
  onKeyUp,
  cssExt,
  rows,
  ref,
  disable = false
}: TextAreaProps) => {
  return (
    <TextAreaWrapper
      ref={ref}
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
