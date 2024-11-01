import { forwardRef } from 'react';
import styled from 'styled-components';

import { userInfoSelector } from '../store/slices/userInfo';
import { useAppSelector } from '../store/store';

import usePrivacyConsent from './hooks/nova/usePrivacyConsent';

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

interface FileButtonProps extends React.ComponentPropsWithoutRef<'input'> {
  target: string;
  handleOnChange?: (files: File[]) => void;
}

const FileButton = forwardRef<HTMLInputElement, FileButtonProps>((props, ref) => {
  const { target, children, accept, handleOnChange, ...otherProps } = props;

  const inputId = `__upload-local-file-${target}`;
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
