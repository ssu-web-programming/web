import React, { useEffect, useRef, useState } from 'react';
import IconButton from 'components/buttons/IconButton';
import useClipboard from 'components/hooks/nova/use-clipboard';
import Icon from 'components/Icon';
import { ReactComponent as DeleteDarkIcon } from 'img/dark/ico_input_delete.svg';
import PlusCircleDarkIcon from 'img/dark/ico_plus_circle.svg';
import { ReactComponent as SendDisabledDarkIcon } from 'img/dark/ico_send_disabled.svg';
import ico_plus_circle from 'img/ico_plus_circle.svg';
import ico_file_csv from 'img/light/ico_file_csv.svg';
import ico_file_doc from 'img/light/ico_file_doc.svg';
import ico_file_hwp from 'img/light/ico_file_hwp.svg';
import ico_file_img from 'img/light/ico_file_img.svg';
import ico_file_odt from 'img/light/ico_file_odt.svg';
import ico_file_pdf from 'img/light/ico_file_pdf.svg';
import ico_file_pps from 'img/light/ico_file_pps.svg';
import ico_file_ppt from 'img/light/ico_file_ppt.svg';
import ico_file_sheet from 'img/light/ico_file_sheet.svg';
import ico_file_slide from 'img/light/ico_file_slide.svg';
import ico_file_txt from 'img/light/ico_file_txt.svg';
import ico_file_word from 'img/light/ico_file_word.svg';
import ico_file_xls from 'img/light/ico_file_xls.svg';
import { ReactComponent as DeleteLightIcon } from 'img/light/ico_input_delete.svg';
import PlusCircleLightIcon from 'img/light/ico_plus_circle.svg';
import { ReactComponent as SendActiveIcon } from 'img/light/ico_send_active.svg';
import { ReactComponent as SendDisabledLightIcon } from 'img/light/ico_send_disabled.svg';
import { useTranslation } from 'react-i18next';
import { NovaChatType } from 'store/slices/nova/novaHistorySlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import styled, { css } from 'styled-components';
import { sliceFileName } from 'util/common';

import { getValidExt, SUPPORT_DOCUMENT_TYPE } from '../../constants/fileTypes';
import { ReactComponent as DocsPlusIconDark } from '../../img/dark/ico_upload_docs_plus.svg';
import { ReactComponent as ImagePlusIconDark } from '../../img/dark/ico_upload_img_plus.svg';
import { ReactComponent as DocsPlusIconLight } from '../../img/light/ico_upload_docs_plus.svg';
import { ReactComponent as ImagePlusIconLight } from '../../img/light/ico_upload_img_plus.svg';
import LoadingSpinner from '../../img/light/spinner.webp';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { themeInfoSelector } from '../../store/slices/theme';
import {
  DriveFileInfo,
  getDriveFiles,
  getLoadingFile,
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  border-top: ${({ theme }) => (theme.mode === 'dark' ? '1px solid var(--gray-gray-87)' : 'none')};
  box-shadow: ${({ theme }) =>
    theme.mode === 'light' ? '0px -4px 8px 0px var(--gray-shadow-light)' : 'none'};
  background-color: ${({ theme }) =>
    theme.mode === 'light' ? theme.color.subBgGray01 : 'transparent'};

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

const ClipboardItem = styled.div`
  width: fit-content;
  position: relative;
  ${flexCenter};
  border-radius: 8px;
  background: ${({ theme }) => theme.color.subBgGray04};
  color: ${({ theme }) => theme.color.text.subGray04};

  font-size: 16px;
  line-height: 21px;
  text-align: left;

  .uploading {
    font-weight: 700;
    color: #6f3ad0;
  }

  svg {
    position: absolute;
    top: -4px;
    right: -4px;
  }

  & > img {
    border-radius: 12px;
    border: 1px solid #c9cdd2;
  }
`;

const FileItem = styled.div`
  width: fit-content;
  height: 48px;
  position: relative;
  ${flexCenter};
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.subBgGray04};
  color: ${({ theme }) => theme.color.text.subGray04};

  font-size: 16px;
  line-height: 21px;
  text-align: left;

  .uploading {
    font-weight: 700;
    color: #6f3ad0;
  }

  svg {
    position: absolute;
    top: -4px;
    right: -4px;
  }
`;

const InputTxtWrapper = styled.div<{ hasValue: boolean }>`
  width: 100%;
  min-height: 40px;
  height: auto;
  padding: 6px 12px;
  box-sizing: border-box;
  display: flex;
  gap: 8px;

  & > div:nth-child(1) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & > div:nth-child(2) {
    z-index: 1;
    padding: 1px;
    border-radius: 4px;
    border: 1px solid
      ${({ theme, hasValue }) => (hasValue ? 'var(--ai-purple-50-main)' : theme.color.borderGray01)};
    overflow: hidden;
    flex-grow: 1;
  }

  & > div:nth-child(3) {
    display: flex;
    flex-direction: column-reverse;
    margin-bottom: 5px;
  }
`;

const TextArea = styled.textarea<{ value: string }>`
  display: flex;
  width: 100%;
  height: 40px;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  border-radius: 3px;
  border-style: solid;
  border-width: 10px 6px 10px 16px;
  border-color: transparent;
  resize: none;
  word-break: break-all;
  font-size: 14px;
  line-height: 20px;
  z-index: 2;
  color: ${({ theme }) => theme.color.text.subGray04};
  background-color: transparent;

  scrollbar-width: thin;
  scrollbar-color: #c9cdd2 transparent;

  &::placeholder {
    color: ${({ value }) => (value ? 'transparent' : '#aaa')};
  }

  @media screen and (orientation: portrait) {
    /* 세로 모드 스타일 */
    max-height: 140px;
  }

  @media screen and (orientation: landscape) {
    /* 가로 모드 스타일 */
    max-height: 60px;
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

  const { isLightMode } = useAppSelector(themeInfoSelector);
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);
  const loadingFile = useAppSelector(getLoadingFile);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const {
    pastedImages,
    handleRemovePastedImages,
    pastedImagesAsFileType,
    handleClearPastedImages
  } = useClipboard();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputDocsFileRef = useRef<HTMLInputElement | null>(null);
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);

  const [activatedUploadBtn, setActivatedUploadBtn] = useState(false);

  const handleActiveUploadBtn = () => {
    setActivatedUploadBtn(true);
  };

  const handleInActiveUploadBtn = () => {
    setActivatedUploadBtn(false);
  };

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
      textarea.style.height = `${textarea.scrollHeight > 20 ? textarea.scrollHeight + 20 : 40}px`;
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
    const hasLocalFiles = localFiles.length > 0;
    const hasDriveFiles = driveFiles.length > 0;
    const hasPasteImages = pastedImagesAsFileType.length > 0;

    (document.activeElement as HTMLElement)?.blur();
    setContents('');
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    handleClearPastedImages();

    const targetFiles = hasLocalFiles
      ? localFiles
      : hasDriveFiles
        ? driveFiles
        : pastedImagesAsFileType;

    const fileType =
      targetFiles.length < 1
        ? ''
        : targetFiles[0].type.split('/')[0].includes('image')
          ? 'image'
          : 'document';

    await props.onSubmit({
      input: contents,
      files: hasLocalFiles
        ? localFiles
        : hasDriveFiles
          ? driveFiles
          : hasPasteImages
            ? pastedImagesAsFileType
            : [],
      type: fileType
    });
    textAreaRef.current?.focus();
  };

  const UPLOAD_BTN_LIST = [
    {
      target: 'nova-file',
      accept: SUPPORT_DOCUMENT_TYPE,
      children: isLightMode ? <DocsPlusIconLight /> : <DocsPlusIconDark />,
      ref: inputDocsFileRef
    },
    {
      target: 'nova-image',
      accept: getValidExt(selectedNovaTab),
      children: isLightMode ? <ImagePlusIconLight /> : <ImagePlusIconDark />,
      ref: inputImgFileRef
    }
  ];

  return (
    <InputBarBase disabled={disabled || expiredNOVA}>
      {pastedImages.length > 0 && (
        <FileListViewer onWheel={handleWheel}>
          {pastedImages.map((file) => (
            <ClipboardItem key={file.id}>
              <Icon size={64} iconSrc={file.url} />
              {isLightMode ? (
                <DeleteLightIcon onClick={() => handleRemovePastedImages(file)} />
              ) : (
                <DeleteDarkIcon onClick={() => handleRemovePastedImages(file)} />
              )}
            </ClipboardItem>
          ))}
        </FileListViewer>
      )}
      {localFiles.length > 0 && (
        <FileListViewer onWheel={handleWheel}>
          {localFiles.map((file: File) => (
            <FileItem key={file.name}>
              <Icon size={28} iconSrc={getFileIcon(file.name)} />
              <span>{sliceFileName(file.name)}</span>
              {isLightMode ? (
                <DeleteLightIcon onClick={() => handleRemoveLocalFile(file)} />
              ) : (
                <DeleteDarkIcon onClick={() => handleRemoveLocalFile(file)} />
              )}
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
              {isLightMode ? (
                <DeleteLightIcon onClick={() => handleRemoveDriveFile(file)} />
              ) : (
                <DeleteDarkIcon onClick={() => handleRemoveDriveFile(file)} />
              )}
            </FileItem>
          ))}
        </FileListViewer>
      )}
      {loadingFile.id !== '' && (
        <FileListViewer onWheel={handleWheel}>
          <FileItem>
            <Icon size={21} iconSrc={LoadingSpinner} />
            <span className="uploading">{t(`Nova.aiChat.Uploading`)}</span>
          </FileItem>
        </FileListViewer>
      )}
      <InputTxtWrapper hasValue={!!contents}>
        <div>
          {activatedUploadBtn ? (
            <UploadBtn>
              {UPLOAD_BTN_LIST.map((btn) => (
                <FileUploader
                  key={btn.target}
                  target={btn.target}
                  accept={btn.accept}
                  inputRef={btn.ref}
                  tooltipStyle={{ padding: '12px 16px' }}
                  onFinish={handleInActiveUploadBtn}>
                  {btn.children}
                </FileUploader>
              ))}
            </UploadBtn>
          ) : (
            <Icon
              iconSrc={isLightMode ? PlusCircleLightIcon : PlusCircleDarkIcon}
              size={24}
              onClick={handleActiveUploadBtn}
            />
          )}
        </div>
        <div>
          <TextArea
            placeholder={t(`Nova.ActionWindow.Placeholder`)!}
            value={contents}
            onChange={handleChange}
            maxLength={1000}
            ref={textAreaRef}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && e.shiftKey) {
                return;
              }

              if (e.key === 'Enter') {
                if (contents.length > 0) {
                  handleOnClick();
                } else {
                  e.preventDefault();
                }
              }
            }}
            onFocus={() => {
              handleInActiveUploadBtn();
            }}
          />
        </div>
        <div>
          <IconButton
            disable={contents.length < 1}
            onClick={handleOnClick}
            iconSize="lg"
            iconComponent={
              contents.length < 1
                ? isLightMode
                  ? SendDisabledLightIcon
                  : SendDisabledDarkIcon
                : SendActiveIcon
            }
            cssExt={css`
              opacity: 1;
              padding: 0;
            `}
          />
        </div>
      </InputTxtWrapper>
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
    bmp: ico_file_img,
    webp: ico_file_img,
    word: ico_file_word,
    slide: ico_file_slide,
    sheet: ico_file_sheet
  };

  return fileIconMap[fileExt.toLowerCase()] || null;
};
