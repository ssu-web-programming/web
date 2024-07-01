import styled from 'styled-components';

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
}

function FileButton(props: React.PropsWithChildren<FileButtonProps>) {
  const { target, children, accept, handleOnChange, ...otherProps } = props;
  const inputId = `__upload-local-file-${target}`;
  return (
    <FileButtonBase>
      <Label htmlFor={inputId}>{children}</Label>
      <input
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
}

export default FileButton;
