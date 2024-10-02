import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ClientType, getPlatform } from 'util/bridge';

import { getValidExt } from '../constants/fileTypes';
import { selectTabSlice } from '../store/slices/tabSlice';
import { userInfoSelector } from '../store/slices/userInfo';
import { useAppSelector } from '../store/store';

import usePrivacyConsent from './hooks/nova/usePrivacyConsent';
import { getAccept } from './nova/FileUploader';
import { useConfirm } from './Confirm';

const FileButtonBase = styled.button`
  width: 100%;
  height: 100%;
  background-color: transparent;
  padding: 0;
`;

const Label = styled.label<{ disable: boolean }>`
  width: 100%;
  height: 100%;
  display: block;
  cursor: ${(props) => (props.disable ? 'initial' : 'pointer')};
  color: ${(props) => (props.disable ? '#454c5380' : 'var(--gray-gray-80-02)')};
  -webkit-tap-highlight-color: transparent;
`;

const PersonalInfoContents = styled.div`
  text-align: left;
  font-size: 15px;
  letter-spacing: -0.3px;
`;

interface FileButtonProps extends React.ComponentPropsWithoutRef<'input'> {
  target: string;
  handleOnChange?: (files: File[]) => void;
}

const FileButton = forwardRef<HTMLInputElement, FileButtonProps>((props, ref) => {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { target, children, accept, handleOnChange, ...otherProps } = props;

  const inputId = `__upload-local-file-${target}`;
  const confirm = useConfirm();
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const { handleAgreement } = usePrivacyConsent();

  return (
    <FileButtonBase onClick={() => handleAgreement()}>
      <Label disable={isAgreed === undefined}>{children}</Label>
      <input
        ref={ref}
        id={inputId}
        type="file"
        hidden
        accept={accept}
        onChange={async (e) => {
          if (e.currentTarget.files) {
            const files = Array.from(e.currentTarget.files);
            const invalid = files.filter((file) => {
              const fileAccept = getAccept(file);
              if (getPlatform() === ClientType.unknown) {
                return !accept?.split(',').includes(fileAccept);
              } else {
                return !accept?.includes(fileAccept);
              }
            });
            const support = accept?.includes(getValidExt(selectedNovaTab)[0].extensions[0])
              ? 'jpg, png, gif'
              : 'docx, pptx, pdf, hwp, xlsx';
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

FileButton.displayName = 'FileButton';
