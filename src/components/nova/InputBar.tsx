import { useState, useEffect, useRef, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import FileButton from 'components/FileButton';
import IconButton from 'components/buttons/IconButton';
import Icon from 'components/Icon';
import { ReactComponent as FileIcon } from '../../img/file.svg';
import { ReactComponent as ImageIcon } from '../../img/landscape.svg';
import { ReactComponent as SendActiveIcon } from 'img/ico_send_active.svg';
import { ReactComponent as SendDisabledIcon } from 'img/ico_send_disabled.svg';
import { ReactComponent as DeleteIcon } from 'img/ico_delete.svg';
import ico_docs_hwp from 'img/ico_docs_hwp.svg';
import ico_docs_docx from 'img/ico_docs_docx.svg';
import ico_docs_xlsx from 'img/ico_docs_xlsx.svg';
import ico_docs_pptx from 'img/ico_docs_pptx.svg';
import ico_docs_odt from 'img/ico_docs_odt.svg';
import ico_docs_img from 'img/landscape.svg';

import Tooltip from 'components/Tooltip';
import ico_cloud from 'img/ico_cloud.svg';
import ico_local from 'img/ico_local.svg';
import { NovaChatType } from 'store/slices/novaHistorySlice';
import { useTranslation } from 'react-i18next';

export const flexCenter = css`
  display: flex;
  align-items: center;
`;

const InputBarBase = styled.div<{ disabled: boolean }>`
  position: relative;
  width: 100%;
  ${flexCenter}
  flex-direction: column;
  justify-content: center;
  border-top: 2px solid var(--ai-purple-50-main);

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
`;

const FileListViewer = styled.div`
  width: 100%;
  padding: 8px 16px 0px 16px;
  display: flex;
  gap: 8px;
  overflow-x: scroll;
  white-space: nowrap;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const FileItem = styled.div`
  width: fit-content;
  height: 40px;
  ${flexCenter}
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--gray-gray-40);
  border-radius: 8px;
  background: var(--gray-gray-20);

  font-size: 14px;
  line-height: 21px;
  text-align: left;
`;

const InputBtnWrapper = styled.div`
  width: 100%;
  height: 46px;
  padding: 0 16px;
  ${flexCenter}
  justify-content: space-between;
  gap: 8px;
`;

const UploadBtn = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 11px;

  > button {
    width: 32px;
    height: 38px;
    ${flexCenter}
    justify-content: center;
  }
`;

const IconBtnWrapper = styled.div`
  width: 36px;
  height: 36px;
`;

const InputTxtWrapper = styled.div<{ hasValue: boolean }>`
  width: 100%;
  min-height: 40px;
  height: auto;
  padding: 8px 16px 4px;
  box-sizing: border-box;

  > div {
    background: ${({ hasValue }) =>
      hasValue ? 'linear-gradient(180deg, #6f3ad0 0%, #a86cea 100%)' : 'var(--gray-gray-40)'};

    z-index: 1;
    padding: 1px;
    border-radius: 4px;
    overflow: hidden;
  }
`;

const TextArea = styled.textarea<{ value: string }>`
  display: flex;
  width: 100%;
  height: 40px;
  max-height: 60px;
  padding: 0px;
  box-sizing: border-box;
  background: white;
  outline: none;
  border-radius: 3px;
  border: 10px solid white;
  border-right: 6px solid white;
  border-left: 16px solid white;
  resize: none;
  word-break: break-all;
  font-size: 14px;
  line-height: 20px;
  z-index: 2;

  scrollbar-width: thin;
  scrollbar-color: #c9cdd2 transparent;

  // &::-webkit-scrollbar-button {
  //   display: none;
  // }

  &::placeholder {
    color: ${({ value }) => (!!value ? 'transparent' : '#aaa')};
  }
`;

export interface InputBarSubmitParam extends Pick<NovaChatType, 'input' | 'type'> {
  files?: File[];
}

interface InputBarProps {
  disabled?: boolean;
  onSubmit: (param: InputBarSubmitParam) => void;
  contents?: string;
}

type FileListProps = {
  files: File[];
  onRemoveFile: (file: File) => void;
};

type FileUploaderProps = {
  onLoadFile: (files: FileList) => void;
  isAgreed: boolean;
  setIsAgreed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function InputBar(props: InputBarProps) {
  const { disabled = false, contents = '' } = props;
  const [localFiles, setLocalFiles] = useState<File[]>([]);

  const [text, setText] = useState<string>(contents);
  const [isAgreed, setIsAgreed] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const { t } = useTranslation();

  const loadlocalFile = (files: FileList) => {
    // TODO : check file extension
    setLocalFiles(Array.from(files));
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    if (inputText.length <= 1000) {
      setText(inputText);
    }
  };

  const handleRemoveFile = (file: File) => {
    setLocalFiles(localFiles.filter((prev) => prev !== file));
  };

  const adjustTextareaHeight = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = '1px';
      textarea.style.height = `${textarea.scrollHeight > 20 ? 60 : 40}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

  return (
    <InputBarBase disabled={disabled}>
      {localFiles.length > 0 && (
        <InputBar.FileList files={localFiles} onRemoveFile={handleRemoveFile} />
      )}
      <InputTxtWrapper hasValue={!!text}>
        <div>
          <TextArea
            placeholder={t(`Nova.ActionWindow.Placeholder`)!}
            value={text}
            onChange={handleChange}
            maxLength={1000}
            ref={textAreaRef}
          />
        </div>
      </InputTxtWrapper>
      <InputBtnWrapper>
        <InputBar.FileUploader
          onLoadFile={loadlocalFile}
          isAgreed={isAgreed}
          setIsAgreed={setIsAgreed}
          ref={inputFileRef}
        />

        <IconBtnWrapper>
          <IconButton
            disable={text.length < 1}
            onClick={() => {
              // TODO : refactor
              const fileType =
                localFiles.length < 1
                  ? ''
                  : localFiles[0].type.split('/')[0].includes('image')
                  ? 'image'
                  : 'document';
              props.onSubmit({ input: text, files: localFiles, type: fileType });
              setText('');
              setLocalFiles([]);
            }}
            iconSize="lg"
            iconComponent={text.length < 1 ? SendDisabledIcon : SendActiveIcon}
          />
        </IconBtnWrapper>
      </InputBtnWrapper>
    </InputBarBase>
  );
}

const FileList = (props: FileListProps) => {
  const { files, onRemoveFile } = props;

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.currentTarget.scrollLeft += e.deltaY;
  };

  const getFileIcon = (file: File) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (!fileExt) return null;

    if (['docx', 'doc'].includes(fileExt)) {
      return ico_docs_docx;
    } else if (['xlsx', 'xls'].includes(fileExt)) {
      return ico_docs_xlsx;
    } else if (['pptx', 'ppt'].includes(fileExt)) {
      return ico_docs_pptx;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
      return ico_docs_img;
    } else if (fileExt === 'odt') {
      return ico_docs_odt;
    } else {
      return ico_docs_hwp;
    }
  };

  const getFileName = (file: File) => {
    const fileName = file.name;
    if (fileName.length > 20) {
      const fileExt = fileName.split('.').pop() || '';
      const fileNameWithoutExt = fileName.slice(0, 20 - fileExt.length - 1);
      return `${fileNameWithoutExt}…${fileExt}`;
    }
    return fileName;
  };

  return (
    <FileListViewer onWheel={handleWheel}>
      {files.map((file: File) => (
        <FileItem key={file.name}>
          <Icon size={28} iconSrc={getFileIcon(file)} />
          <span>{getFileName(file)}</span>
          <IconButton iconSize="lg" iconComponent={DeleteIcon} onClick={() => onRemoveFile(file)} />
        </FileItem>
      ))}
    </FileListViewer>
  );
};

const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  (props: FileUploaderProps, ref) => {
    const { onLoadFile, isAgreed, setIsAgreed } = props;
    const { t } = useTranslation();

    const TOOLTIP_UPLOAD_OPTION = [
      {
        name: t(`Nova.UploadTooltip.PolarisDrive`),
        icon: { src: ico_cloud },
        onClick: () => alert('폴라리스 드라이브')
      },
      {
        name: t(`Nova.UploadTooltip.Local`),
        icon: { src: ico_local },
        onClick: () => (ref as React.MutableRefObject<HTMLInputElement>)?.current?.click()
      }
    ];

    const handleOnClick = () => {
      if (!isAgreed) {
        setIsAgreed(() => true);
      } else {
        (ref as React.MutableRefObject<HTMLInputElement>)?.current?.click();
      }
    };

    const UPLOAD_BTN_LIST = [
      {
        target: 'nova-file',
        accept: '.docx, .doc, .pptx, .ppt, .xlsx, .xls, .hwp, .pdf',
        children: <FileIcon />
      },
      {
        target: 'nova-image',
        accept: '.jpg, .png, .gif',
        children: <ImageIcon />
      }
    ];

    return (
      <UploadBtn>
        {UPLOAD_BTN_LIST.map((btn) => (
          <Tooltip
            key={btn.target}
            placement="top-start"
            type="selectable"
            options={TOOLTIP_UPLOAD_OPTION}
            distance={10}
            condition={isAgreed}
            initPos>
            <FileButton
              target={btn.target}
              accept={btn.accept}
              handleOnChange={onLoadFile}
              multiple
              isAgreed={isAgreed}
              handleOnClick={handleOnClick}
              ref={ref}>
              {btn.children}
            </FileButton>
          </Tooltip>
        ))}
      </UploadBtn>
    );
  }
);

InputBar.FileList = FileList;
InputBar.FileUploader = FileUploader;
