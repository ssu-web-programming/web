import { forwardRef } from 'react';
import styled from 'styled-components';
import { useConfirm } from './Confirm';
import { useTranslation } from 'react-i18next';
import { SUPPORT_IMAGE_TYPE } from 'pages/Nova/Nova';

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
      title: t(`Nova.Confirm.PersonalInfo.Title`)!,
      msg: t(`Nova.Confirm.PersonalInfo.Msg`),
      onCancel: { text: t(`Nova.Confirm.PersonalInfo.Cancel`), callback: () => {} },
      onOk: {
        text: t(`Nova.Confirm.PersonalInfo.Ok`),
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
        onChange={async (e) => {
          if (e.currentTarget.files) {
            const files = Array.from(e.currentTarget.files);
            const invalid = files.filter((file) => !accept?.includes(file.type));
            const support = accept?.includes(SUPPORT_IMAGE_TYPE[0].mimeType)
              ? 'jpg, png, gif'
              : 'doc, pptx, pdf, hwp, xlsx';
            if (invalid.length > 0) {
              confirm({
                title: '',
                msg: t('Nova.Alert.UnsupportFile', { support }),
                onOk: {
                  text: t(`Confirm`),
                  callback: () => {}
                }
              });
              return;
            }
            handleOnChange?.(files);
          }
          e.currentTarget.value = '';
        }}
        {...otherProps}
      />
    </FileButtonBase>
  );
});

export default FileButton;
