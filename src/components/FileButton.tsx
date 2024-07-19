import { forwardRef } from 'react';
import styled from 'styled-components';
import { useConfirm } from './Confirm';
import { useTranslation } from 'react-i18next';

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
  handleOnChange?: (files: File[]) => void;
  isAgreed?: boolean;
  handleOnClick: () => void;
}

const FileButton = forwardRef<HTMLInputElement, FileButtonProps>((props, ref) => {
  const { t } = useTranslation();
  const { target, children, accept, handleOnChange, isAgreed, handleOnClick, ...otherProps } =
    props;

  const inputId = `__upload-local-file-${target}`;
  const confirm = useConfirm();

  const handleAgreement = async () => {
    if (isAgreed === true) return;

    const isConfirmed = await confirm({
      title: t(`Nova.ConfirmPersonalInfo.Title`)!,
      msg: t(`Nova.ConfirmPersonalInfo.Msg`),
      onCancel: { text: t(`Nova.ConfirmPersonalInfo.Cancel`), callback: () => {} },
      onOk: {
        text: t(`Nova.ConfirmPersonalInfo.Ok`),
        callback: () => {}
      },
      direction: 'row'
    });

    if (!!isConfirmed) {
      handleOnClick();
    }
  };

  return (
    <FileButtonBase onClick={handleAgreement}>
      <Label>{children}</Label>
      <input
        ref={ref}
        id={inputId}
        type="file"
        hidden
        accept={accept}
        onChange={(e) => {
          if (e.currentTarget.files) {
            const files = Array.from(e.currentTarget.files);
            const valid = files.filter((file) => accept?.includes(file.type));
            handleOnChange?.(valid);
          }
          e.currentTarget.value = '';
        }}
        {...otherProps}
      />
    </FileButtonBase>
  );
});

export default FileButton;
