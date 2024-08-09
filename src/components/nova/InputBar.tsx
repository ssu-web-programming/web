import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import FileButton from 'components/FileButton';
import IconButton from 'components/buttons/IconButton';
import Icon from 'components/Icon';
import DriveConfirm from 'components/DriveConfirm';
import { ReactComponent as DocsPlusIcon } from '../../img/ico_upload_docs_plus.svg';
import { ReactComponent as ImagePlusIcon } from '../../img/ico_upload_img_plus.svg';
import { ReactComponent as SendActiveIcon } from 'img/ico_send_active.svg';
import { ReactComponent as SendDisabledIcon } from 'img/ico_send_disabled.svg';
import { ReactComponent as DeleteIcon } from 'img/ico_delete.svg';
import ico_file_doc from 'img/ico_file_doc.svg';
import ico_file_hwp from 'img/ico_file_hwp.svg';
import ico_file_odt from 'img/ico_file_odt.svg';
import ico_file_xls from 'img/ico_file_xls.svg';
import ico_file_csv from 'img/ico_file_csv.svg';
import ico_file_ppt from 'img/ico_file_ppt.svg';
import ico_file_pps from 'img/ico_file_pps.svg';
import ico_file_pdf from 'img/ico_file_pdf.svg';
import ico_file_txt from 'img/ico_file_txt.svg';
import ico_file_img from 'img/ico_file_img.svg';
import ico_file_word from 'img/ico_file_word.svg';
import ico_file_slide from 'img/ico_file_slide.svg';
import ico_file_sheet from 'img/ico_file_sheet.svg';
import Tooltip from 'components/Tooltip';
import ico_logo_po from 'img/ico_logo_po.svg';
import ico_mobile from 'img/ico_mobile.svg';
import ico_pc from 'img/ico_pc.svg';
import ico_camera from 'img/ico_camera.svg';
import { NovaChatType } from 'store/slices/novaHistorySlice';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/store';
import { setNovaAgreement, userInfoSelector } from 'store/slices/userInfo';
import { apiWrapper } from 'api/apiWrapper';
import { NOVA_SET_USER_INFO_AGREEMENT } from 'api/constant';
import {
  isValidFileSize,
  MAX_FILE_UPLOAD_SIZE_MB,
  MIN_FILE_UPLOAD_SIZE_KB,
  SUPPORT_DOCUMENT_TYPE,
  SUPPORT_IMAGE_TYPE,
  SupportFileType
} from 'pages/Nova/Nova';
import { useConfirm } from 'components/Confirm';
import PoDrive, { DriveFileInfo } from 'components/PoDrive';
import useUserInfoUtils from 'components/hooks/useUserInfoUtils';
import { useChatNova } from 'components/hooks/useChatNova';
import { ClientType, getPlatform } from 'util/bridge';
import { getFileExtension, sliceFileName } from 'util/common';

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
  ${flexCenter}
  justify-content: space-between;
  gap: 8px;
`;

const UploadBtn = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;

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

interface FileListItemInfo {
  name: string;
}

type FileUploaderProps = {
  loadlocalFile: (files: File[]) => void;
  isAgreed: boolean | undefined;
  setIsAgreed: (agree: boolean) => void;
  onLoadDriveFile: (files: DriveFileInfo[]) => void;
};

export default function InputBar(props: InputBarProps) {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const { getUploadFileLimit } = useUserInfoUtils();
  const { novaHistory, disabled = false, expiredNOVA = false, contents = '', setContents } = props;
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);

  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const setIsAgreed = async (agree: boolean) => {
    try {
      dispatch(setNovaAgreement(agree));
      await apiWrapper().request(NOVA_SET_USER_INFO_AGREEMENT, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ agree: true })
      });
    } catch (err) {}
  };
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { t } = useTranslation();

  const loadlocalFile = async (files: File[]) => {
    setDriveFiles([]);
    const invalidSize = files.filter((file) => !isValidFileSize(file.size));
    if (invalidSize.length > 0) {
      confirm({
        title: '',
        msg: t('Nova.Alert.OverFileUploadSize', {
          max: MAX_FILE_UPLOAD_SIZE_MB,
          min: MIN_FILE_UPLOAD_SIZE_KB
        })!,
        onOk: { text: t('Confirm'), callback: () => {} }
      });
      return;
    }

    const uploadLimit = getUploadFileLimit();
    const uploadCnt = novaHistory.reduce((acc, cur) => {
      const len = cur.files?.length;
      if (!!len) return acc + len;
      else return acc;
    }, 0);
    if (uploadCnt >= uploadLimit) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFileUploadCnt', { max: uploadLimit })!,
        onOk: { text: t('Nova.Confirm.NewChat.StartNewChat'), callback: chatNova.newCHat },
        onCancel: { text: t('Cancel'), callback: () => {} }
      });
      return;
    }

    if (files.length > uploadLimit) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFileUploadCntOnce', { max: uploadLimit - uploadCnt })!,
        onOk: { text: t('Confirm'), callback: () => {} }
      });
      return;
    }
    setLocalFiles(files);
  };
  const loadDriveFile = (files: DriveFileInfo[]) => {
    setLocalFiles([]);
    setDriveFiles(files);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    if (inputText.length <= 1000) {
      setContents(inputText);
    }
  };

  const handleRemoveLocalFile = (file: FileListItemInfo) => {
    setLocalFiles(localFiles.filter((prev) => prev !== file));
  };

  const handleRemoveDriveFile = (file: FileListItemInfo) => {
    setDriveFiles(driveFiles.filter((prev) => prev !== file));
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
      setLocalFiles([]);
      setDriveFiles([]);
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [expiredNOVA]);

  const handleOnClick = async () => {
    (document.activeElement as HTMLElement)?.blur();
    setContents('');
    setLocalFiles([]);
    setDriveFiles([]);
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

  return (
    <InputBarBase disabled={disabled || expiredNOVA}>
      {localFiles.length > 0 && (
        <FileListViewer onWheel={handleWheel}>
          {localFiles.map((file: FileListItemInfo) => (
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
          {driveFiles.map((file: FileListItemInfo) => (
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
        <InputBar.FileUploader
          loadlocalFile={loadlocalFile}
          isAgreed={isAgreed}
          setIsAgreed={setIsAgreed}
          onLoadDriveFile={loadDriveFile}
        />

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

const FileUploader = (props: FileUploaderProps) => {
  const { loadlocalFile, isAgreed, setIsAgreed, onLoadDriveFile } = props;
  const { t } = useTranslation();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const { getUploadFileLimit, getDriveSelectFileCount } = useUserInfoUtils();
  const inputDocsFileRef = useRef<HTMLInputElement | null>(null);
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<number>(0);
  const [uploadTarget, setUploadTarget] = useState<string>('');

  const toggleDriveConfirm = () => {
    setIsOpen(!isOpen);
  };

  const getCurrentFileInput = (target: string) => {
    if (target === 'nova-file') {
      return inputDocsFileRef;
    } else if (target === 'nova-image') {
      return inputImgFileRef;
    }
  };

  const TOOLTIP_UPLOAD_OPTION = (target: string) => {
    const options = [
      {
        name: t(`Nova.UploadTooltip.PolarisDrive`),
        icon: { src: ico_logo_po },
        onClick: async () => {
          if (isAgreed) {
            setUploadTarget(target);
            toggleDriveConfirm();
          }
          const uploadLimit = getDriveSelectFileCount();
          if (uploadLimit === 0) {
            await confirm({
              title: '',
              msg: t('Nova.Confirm.OverMaxFileUploadCnt', { max: getUploadFileLimit() })!,
              onOk: { text: t('Nova.Confirm.NewChat.StartNewChat'), callback: chatNova.newCHat },
              onCancel: { text: t('Cancel'), callback: () => {} }
            });
            return;
          }
        }
      },
      {
        name: t(`Nova.UploadTooltip.Local`),
        icon: {
          src:
            getPlatform() === ClientType.android || getPlatform() === ClientType.ios
              ? ico_mobile
              : ico_pc
        },
        onClick: () => {
          const element = getCurrentFileInput(target)?.current;
          if (element) {
            const targetType = target === 'nova-image' ? SUPPORT_IMAGE_TYPE : SUPPORT_DOCUMENT_TYPE;
            element.accept = getAccept(targetType);
            element.click();
          }
        }
      },
      {
        name: t(`Nova.UploadTooltip.Camera`),
        icon: { src: ico_camera },
        onClick: () => {
          const element = getCurrentFileInput(target)?.current;
          if (element) {
            element.accept = 'camera';
            element.click();
          }
        }
      }
    ];

    return target === 'nova-image' && getPlatform() === ClientType.android
      ? options
      : options.slice(0, 2);
  };

  const handleOnClick = () => {
    if (!isAgreed) {
      setIsAgreed(true);
    }
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

  const handleDriveCancel = () => {
    toggleDriveConfirm();
    onLoadDriveFile([]);
    setUploadTarget('');
  };

  return (
    <UploadBtn>
      {UPLOAD_BTN_LIST.map((btn) => (
        <React.Fragment key={btn.target}>
          <Tooltip
            key={btn.target}
            placement="top-start"
            type="selectable"
            options={TOOLTIP_UPLOAD_OPTION(btn.target)}
            distance={10}
            condition={!!isAgreed}
            initPos>
            <FileButton
              target={btn.target}
              accept={getAccept(btn.accept)}
              handleOnChange={loadlocalFile}
              multiple
              isAgreed={isAgreed}
              handleOnClick={handleOnClick}
              ref={btn.ref}>
              {btn.children}
            </FileButton>
          </Tooltip>
        </React.Fragment>
      ))}

      {isOpen && (
        <DriveConfirm
          title={t('Nova.UploadTooltip.PolarisDrive')}
          msg={
            <>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  marginBottom: '24px'
                }}>
                {t(uploadTarget === 'nova-file' ? 'Nova.PoDrive.Desc' : 'Nova.PoDrive.DescImg', {
                  size: MAX_FILE_UPLOAD_SIZE_MB,
                  count: getUploadFileLimit()
                })}
              </div>
              <PoDrive
                max={getUploadFileLimit()}
                onChange={(files: DriveFileInfo[]) => onLoadDriveFile(files)}
                target={uploadTarget}
                handleSelectedFiles={(arg: number) => setSelectedFiles(arg)}
              />
            </>
          }
          onOk={{
            text: !!selectedFiles ? t('SelectionComplete') : t('Select'),
            callback: toggleDriveConfirm,
            disable: !selectedFiles
          }}
          onCancel={{ text: t('Cancel'), callback: handleDriveCancel }}
        />
      )}
    </UploadBtn>
  );
};

InputBar.FileUploader = FileUploader;

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

export const getAccept = (infos: SupportFileType[] | File) => {
  // web = extensioin, others = mimeType
  const platform = getPlatform();
  if (infos instanceof File) {
    if (platform === ClientType.unknown) {
      return getFileExtension(infos.name.toLowerCase());
    } else {
      return infos.type;
    }
  } else {
    if (platform === ClientType.unknown) {
      return infos.map((type) => type.extensions).join(',');
    } else {
      return infos.map((type) => type.mimeType).join(',');
    }
  }
};
