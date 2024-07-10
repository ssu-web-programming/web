import { forwardRef } from 'react';
import styled from 'styled-components';
import { useConfirm } from './Confirm';

const FileButtonBase = styled.button`
  width: fit-content;
  height: fit-content;
  background-color: transparent;
`;

const Label = styled.label`
  display: block;
  cursor: pointer;
`;

interface FileButtonProps extends React.ComponentPropsWithoutRef<'input'> {
  target: string;
  handleOnChange?: (files: FileList) => void;
  isAgreed?: boolean;
  handleOnClick: () => void;
}

const FileButton = forwardRef<HTMLInputElement, FileButtonProps>((props, ref) => {
  const { target, children, accept, handleOnChange, isAgreed, handleOnClick, ...otherProps } =
    props;

  const inputId = `__upload-local-file-${target}`;
  const confirm = useConfirm();

  const handleClick = async () => {
    if (isAgreed === true) return;

    const isConfirmed = await confirm({
      title: '개인정보 수집 및 이용동의 (필수)',
      msg: 'AI NOVA 서비스를 제공하기 위해 다음과 같이 개인정보 추가 동의가 필요합니다.',
      onCancel: { text: '동의 안 함', callback: () => {} },
      onOk: {
        text: '동의',
        callback: () => {}
      },
      direction: 'row'
    });

    if (!!isConfirmed) {
      handleOnClick();
    }
  };

  return (
    <FileButtonBase onClick={handleClick}>
      <Label>{children}</Label>
      <input
        ref={ref}
        id={inputId}
        type="file"
        hidden
        accept={accept}
        onChange={(e) => {
          if (e.currentTarget.files) handleOnChange?.(e.currentTarget.files);
          e.currentTarget.value = '';
        }}
        {...otherProps}
      />
    </FileButtonBase>
  );
});

export default FileButton;
