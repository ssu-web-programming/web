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
  -webkit-tap-highlight-color: transparent;
`;

const Label = styled.label<{ disable: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  cursor: ${(props) => (props.disable ? 'initial' : 'pointer')};
  color: ${(props) => (props.disable ? '#454c5380' : 'var(--gray-gray-80-02)')};
  align-items: center;
  justify-content: center;
`;

interface FileButtonProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onClick'> {
  target: string;
  handleOnChange?: (files: File[]) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // button의 onClick 타입으로 정의
}

const FileButton = forwardRef<HTMLInputElement, FileButtonProps>((props, ref) => {
  const { target, children, accept, handleOnChange, onClick: handleClick, ...otherProps } = props;

  const inputId = `__upload-local-file-${target}`;
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const { handleAgreement } = usePrivacyConsent();

  return (
    <FileButtonBase onClick={target === 'nova-voice-dictation' ? handleClick : handleAgreement}>
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
