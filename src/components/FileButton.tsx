import { forwardRef } from 'react';
import styled from 'styled-components';
import { useConfirm } from './Confirm';
import { useTranslation } from 'react-i18next';
import { SUPPORT_IMAGE_TYPE } from 'pages/Nova/Nova';
import { getAccept } from './nova/InputBar';

const FileButtonBase = styled.button`
  width: fit-content;
  height: fit-content;
  background-color: transparent;
  padding: 0;
`;

const Label = styled.label<{ disable: boolean }>`
  display: block;
  cursor: ${(props) => (props.disable ? 'initial' : 'pointer')};
  color: ${(props) => (props.disable ? '#454c5380' : 'var(--gray-gray-80-02)')};
`;

const PersonalInfoContents = styled.div`
  text-align: left;
  font-size: 15px;
  letter-spacing: -0.3px;
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

  const Msg = () => {
    const chatRetention = t('Nova.Confirm.PersonalInfo.ChatRetention');
    const fileRetention = t('Nova.Confirm.PersonalInfo.FileRetention');

    const msg1 = t('Nova.Confirm.PersonalInfo.Msg1');
    const msg2 = t('Nova.Confirm.PersonalInfo.Msg2', {
      chatRetention,
      fileRetention
    });
    const msg3 = t('Nova.Confirm.PersonalInfo.Msg3');
    const msg = `${msg1}\n\n${msg2}\n\n${msg3}`;
    const splitMsg = msg.split('\n');

    const boldText = (line: string) => {
      const mappings = [
        { key: chatRetention, highlight: <strong>{chatRetention}</strong> },
        { key: fileRetention, highlight: <strong>{fileRetention}</strong> }
      ];

      for (const { key, highlight } of mappings) {
        if (line.includes(key)) {
          const [before, after] = line.split(key);

          return (
            <div>
              {before}
              {highlight}
              {after}
            </div>
          );
        }
      }

      return (
        <div>
          {line}
          <br />
        </div>
      );
    };

    return (
      <PersonalInfoContents>
        {splitMsg.map((line, idx) => (
          <div key={idx}>{boldText(line)}</div>
        ))}
      </PersonalInfoContents>
    );
  };

  const handleAgreement = async () => {
    if (isAgreed === true || isAgreed === undefined) return;

    const isConfirmed = await confirm({
      title: t(`Nova.Confirm.PersonalInfo.Title`)!,
      msg: <Msg />,
      onCancel: { text: t(`Nova.Confirm.PersonalInfo.Cancel`), callback: () => {} },
      onOk: {
        text: t(`Nova.Confirm.PersonalInfo.Ok`),
        callback: () => {}
      },
      direction: 'row'
    });

    if (isConfirmed) {
      handleOnClick();
    }
  };

  return (
    <FileButtonBase onClick={handleAgreement}>
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
            const invalid = files.filter((file) => !accept?.includes(getAccept(file)));
            const support = accept?.includes(SUPPORT_IMAGE_TYPE[0].mimeType)
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
