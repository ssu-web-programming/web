import styled, { FlattenSimpleInterpolation } from 'styled-components';

const Textarea = styled.textarea<{ cssExt?: FlattenSimpleInterpolation }>`
  resize: none;
  outline: none;

  ::placeholder {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: var(--gray-gray-60-03);
  }

  font-size: 13px;
  ${(props) => props.cssExt || ''};
`;

interface TextAreaProps {
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: (e: React.MouseEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  cssExt?: FlattenSimpleInterpolation;
  rows?: number;
  textRef?: React.RefObject<HTMLTextAreaElement> | null;
  disable?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  placeholder?: string;
  resize?: boolean;
}

const TextArea = ({
  value,
  onChange = () => {},
  onClick = () => {},
  onKeyDown = () => {},
  onBlur = () => {},
  cssExt,
  rows = 5,
  textRef,
  disable = false,
  placeholder,
  resize = false
}: TextAreaProps) => {
  if (resize && textRef?.current) {
    textRef.current.style.height = 'auto';
    if (value !== '') {
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
    }
  }

  return (
    <Textarea
      onClick={onClick}
      placeholder={placeholder}
      onBlur={onBlur}
      ref={textRef}
      cssExt={cssExt}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      rows={rows}
      disabled={disable}
    />
  );
};

export default TextArea;
