import React, { useEffect, useRef } from 'react';
import IconButton from 'components/buttons/IconButton';
import Icon from 'components/Icon';
import { DriveFileInfo } from 'components/PoDrive';
import { ReactComponent as DeleteIcon } from 'img/ico_delete.svg';
import ico_file_csv from 'img/ico_file_csv.svg';
import ico_file_doc from 'img/ico_file_doc.svg';
import ico_file_hwp from 'img/ico_file_hwp.svg';
import ico_file_img from 'img/ico_file_img.svg';
import ico_file_odt from 'img/ico_file_odt.svg';
import ico_file_pdf from 'img/ico_file_pdf.svg';
import ico_file_pps from 'img/ico_file_pps.svg';
import ico_file_ppt from 'img/ico_file_ppt.svg';
import ico_file_sheet from 'img/ico_file_sheet.svg';
import ico_file_slide from 'img/ico_file_slide.svg';
import ico_file_txt from 'img/ico_file_txt.svg';
import ico_file_word from 'img/ico_file_word.svg';
import ico_file_xls from 'img/ico_file_xls.svg';
import { ReactComponent as SendActiveIcon } from 'img/ico_send_active.svg';
import { ReactComponent as SendDisabledIcon } from 'img/ico_send_disabled.svg';
import { useTranslation } from 'react-i18next';
import { NovaChatType } from 'store/slices/nova/novaHistorySlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import styled, { css } from 'styled-components';
import { sliceFileName } from 'util/common';

import { SUPPORT_DOCUMENT_TYPE, SUPPORT_IMAGE_TYPE } from '../../constants/fileTypes';
import { ReactComponent as DocsPlusIcon } from '../../img/ico_upload_docs_plus.svg';
import { ReactComponent as ImagePlusIcon } from '../../img/ico_upload_img_plus.svg';
import {
  getDriveFiles,
  getLocalFiles,
  removeDriveFile,
  removeLocalFile,
  setDriveFiles,
  setLocalFiles
} from '../../store/slices/uploadFiles';

import { FileUploader } from './FileUploader';

export const flexCenter = css`
  display: flex;
  align-items: center;
`;

const UploadBtn = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;

  > button {
    width: 32px;
    height: 38px;
    ${flexCenter};
    justify-content: center;
  }
`;

const InputBarBase = styled.div<{ disabled: boolean }>`
  position: relative;
  width: 100%;
  ${flexCenter};
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
  padding: 8px 16px 0 16px;
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
  ${flexCenter};
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  background: var(--gray-gray-10);

  font-size: 14px;
  line-height: 21px;
  text-align: left;
`;

const InputBtnWrapper = styled.div`
  width: 100%;
  height: 46px;
  padding: 0 16px;
  ${flexCenter};
  justify-content: space-between;
  gap: 8px;
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
  padding: 0;
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

  &::placeholder {
    color: ${({ value }) => (value ? 'transparent' : '#aaa')};
  }
`;

export interface InputBarSubmitParam extends Pick<NovaChatType, 'input' | 'type'> {
  files?: File[] | DriveFileInfo[];
}

interface InputBarProps {
  novaHistory: NovaChatType[];
  disabled?: boolean;
  expiredNOVA?: boolean;
  onSubmit: (param: InputBarSubmitParam) => Promise<void>;
  contents?: string;
  setContents: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputBar(props: InputBarProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { disabled = false, expiredNOVA = false, contents = '', setContents } = props;

  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputDocsFileRef = useRef<HTMLInputElement | null>(null);
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;

    if (!inputText || !inputText.trim()) {
      setContents('');
      return;
    }

    if (inputText.length <= 1000) {
      setContents(inputText);
    }
  };

  const handleRemoveLocalFile = (file: File) => {
    dispatch(removeLocalFile(file));
  };

  const handleRemoveDriveFile = (file: DriveFileInfo) => {
    dispatch(removeDriveFile(file));
  };
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.currentTarget.scrollLeft += e.deltaY;
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
  }, [contents]);

  useEffect(() => {
    if (expiredNOVA) {
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [expiredNOVA]);

  const handleOnClick = async () => {
    (document.activeElement as HTMLElement)?.blur();
    setContents('');
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    const targetFiles = localFiles.length > 0 ? localFiles : driveFiles;
    const fileType =
      targetFiles.length < 1
        ? ''
        : targetFiles[0].type.split('/')[0].includes('image')
          ? 'image'
          : 'document';
    await props.onSubmit({
      input: contents,
      files: localFiles.length > 0 ? localFiles : driveFiles.length > 0 ? driveFiles : [],
      type: fileType
    });
    textAreaRef.current?.focus();
  };

  const UPLOAD_BTN_LIST = [
    {
      target: 'nova-file',
      accept: SUPPORT_DOCUMENT_TYPE,
      children: <DocsPlusIcon />,
      ref: inputDocsFileRef
    },
    {
      target: 'nova-image',
      accept: SUPPORT_IMAGE_TYPE,
      children: <ImagePlusIcon />,
      ref: inputImgFileRef
    }
  ];

  return (
    <InputBarBase disabled={disabled || expiredNOVA}>
      {localFiles.length > 0 && (
        <FileListViewer onWheel={handleWheel}>
          {localFiles.map((file: File) => (
            <FileItem key={file.name}>
              <Icon size={28} iconSrc={getFileIcon(file.name)} />
              <span>{sliceFileName(file.name)}</span>
              <IconButton
                iconSize="lg"
                iconComponent={DeleteIcon}
                onClick={() => handleRemoveLocalFile(file)}
              />
            </FileItem>
          ))}
        </FileListViewer>
      )}
      {driveFiles.length > 0 && (
        <FileListViewer onWheel={handleWheel}>
          {driveFiles.map((file: DriveFileInfo) => (
            <FileItem key={file.name}>
              <Icon size={28} iconSrc={getFileIcon(file.name)} />
              <span>{sliceFileName(file.name)}</span>
              <IconButton
                iconSize="lg"
                iconComponent={DeleteIcon}
                onClick={() => handleRemoveDriveFile(file)}
              />
            </FileItem>
          ))}
        </FileListViewer>
      )}
      <InputTxtWrapper hasValue={!!contents}>
        <div>
          <TextArea
            placeholder={t(`Nova.ActionWindow.Placeholder`)!}
            value={contents}
            onChange={handleChange}
            maxLength={1000}
            ref={textAreaRef}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                if (contents.length > 0) {
                  handleOnClick();
                } else {
                  e.preventDefault();
                }
              }
            }}
          />
        </div>
      </InputTxtWrapper>
      <InputBtnWrapper>
        <UploadBtn>
          {UPLOAD_BTN_LIST.map((btn) => (
            <FileUploader
              key={btn.target}
              target={btn.target}
              accept={btn.accept}
              inputRef={btn.ref}>
              {btn.children}
            </FileUploader>
          ))}
        </UploadBtn>

        <IconBtnWrapper>
          <IconButton
            disable={contents.length < 1}
            onClick={handleOnClick}
            iconSize="lg"
            iconComponent={contents.length < 1 ? SendDisabledIcon : SendActiveIcon}
            cssExt={css`
              opacity: 1;
              padding: 0;
            `}
          />
        </IconBtnWrapper>
      </InputBtnWrapper>
    </InputBarBase>
  );
}

export const getFileIcon = (name: string) => {
  const fileExt = name.includes('.') ? name.split('.').pop() : name;

  if (!fileExt) return null;

  const fileIconMap: { [key: string]: string } = {
    doc: ico_file_doc,
    docx: ico_file_doc,
    hwp: ico_file_hwp,
    hwpx: ico_file_hwp,
    odt: ico_file_odt,
    xlsx: ico_file_xls,
    xls: ico_file_xls,
    csv: ico_file_csv,
    ppt: ico_file_ppt,
    pptx: ico_file_ppt,
    pps: ico_file_pps,
    ppsx: ico_file_pps,
    pdf: ico_file_pdf,
    txt: ico_file_txt,
    jpg: ico_file_img,
    jpeg: ico_file_img,
    png: ico_file_img,
    gif: ico_file_img,
    word: ico_file_word,
    slide: ico_file_slide,
    sheet: ico_file_sheet
  };

  return fileIconMap[fileExt.toLowerCase()] || null;
};
