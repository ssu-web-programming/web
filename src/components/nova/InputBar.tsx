import styled, { css } from 'styled-components';
import FileButton from 'components/FileButton';
import { ReactComponent as FileIcon } from '../../img/file.svg';
import { ReactComponent as ImageIcon } from '../../img/landscape.svg';
import { useState } from 'react';

const InputBarBase = styled.div<{ disabled: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
`;

const FileListViewer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow-x: auto;
`;

const FileItem = styled.div`
  width: fit-content;
  height: 37px;
  display: flex;
  flex-direction: row;
  border: solid 1px gray;
  padding: 5px;
`;

const InputArea = styled.div`
  width: 100%;
  height: 54px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
`;

const IconButtonWrapper = styled.div`
  width: 32px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputText = styled.input`
  width: 100%;
  height: 38px;
  border: solid 1px gray;
  padding: 7px 12px;
  border: 1px solid #e8ebed;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
`;

export interface InputBarSubmitParam {
  input: string;
  files?: File[];
  fileType: '' | 'image' | 'document';
}

interface InputBarProps {
  disabled?: boolean;
  onSubmit: (param: InputBarSubmitParam) => void;
  contents?: string;
}

export default function InputBar(props: InputBarProps) {
  const { disabled = false, contents = '' } = props;
  const [localFiles, setLocalFiles] = useState<File[]>([]);

  const [text, setText] = useState<string>(contents);

  const loadlocalFile = (files: FileList) => {
    // TODO : check file extension
    setLocalFiles(Array.from(files));
  };

  return (
    <InputBarBase disabled={disabled}>
      {localFiles.length > 0 && (
        <FileListViewer>
          {localFiles.map((file) => (
            <FileItem key={file.name}>
              {file.name}
              <button
                onClick={() => setLocalFiles(localFiles.filter((prev) => prev !== file))}
                style={{ border: 'solid 1px red' }}>
                del
              </button>
            </FileItem>
          ))}
        </FileListViewer>
      )}
      <InputArea>
        <IconButtonWrapper>
          <FileButton
            target={'nova-file'}
            accept=".docx, .doc, .pptx, .ppt, .xlsx, .xls, .hwp, .pdf"
            handleOnChange={loadlocalFile}
            multiple>
            <FileIcon></FileIcon>
          </FileButton>
        </IconButtonWrapper>
        <IconButtonWrapper>
          <FileButton
            target={'nova-image'}
            accept=".jpg, .png, .gif"
            handleOnChange={loadlocalFile}
            multiple>
            <ImageIcon></ImageIcon>
          </FileButton>
        </IconButtonWrapper>
        <InputText
          type="text"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}></InputText>
        <button
          onClick={() => {
            // TODO : refactor
            const fileType =
              localFiles.length < 1
                ? ''
                : localFiles[0].type.split('/')[0].includes('image')
                ? 'image'
                : 'document';
            props.onSubmit({ input: text, files: localFiles, fileType });
            setText('');
            setLocalFiles([]);
          }}>
          go
        </button>
      </InputArea>
    </InputBarBase>
  );
}
