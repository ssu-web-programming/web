import React, { useEffect, useRef, useState } from 'react';
import IconButton from 'components/buttons/IconButton';
import useClipboard from 'components/hooks/nova/use-clipboard';
import Icon from 'components/Icon';
import { ReactComponent as DeleteDarkIcon } from 'img/dark/ico_input_delete.svg';
import PlusCircleDarkIcon from 'img/dark/ico_plus_circle.svg';
import { ReactComponent as SendActiveDarkIcon } from 'img/dark/ico_send_active.svg';
import { ReactComponent as SendDisabledDarkIcon } from 'img/dark/ico_send_disabled.svg';
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
import { ReactComponent as SendActiveLightIcon } from 'img/light/ico_send_active.svg';
import { ReactComponent as SendDisabledLightIcon } from 'img/light/ico_send_disabled.svg';
import { useTranslation } from 'react-i18next';
import {
  novaChatModeSelector,
  NovaChatType,
  setChatMode
} from 'store/slices/nova/novaHistorySlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { css } from 'styled-components';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { isMobile } from 'util/bridge';
import { sliceFileName } from 'util/common';

import { getValidExt, SUPPORT_DOCUMENT_TYPE } from '../../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import {
  getChatGroupKey,
  getMenuItemsFromServiceGroup,
  SERVICE_TYPE
} from '../../../constants/serviceType';
import { ReactComponent as DocsIconDark } from '../../../img/dark/ico_input_upload_docs.svg';
import { ReactComponent as ImagesIconDark } from '../../../img/dark/ico_input_upload_images.svg';
import NovaLogoDarkIcon from '../../../img/dark/nova/ico_logo_nova.svg';
import { ReactComponent as DocsIconLight } from '../../../img/light/ico_input_upload_docs.svg';
import { ReactComponent as ImagesIconLight } from '../../../img/light/ico_input_upload_images.svg';
import NovaLogoLightIcon from '../../../img/light/nova/ico_logo_nova.svg';
import LoadingSpinner from '../../../img/light/spinner.webp';
import {
  selectAllServiceCredits,
  selectPageStatus,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { selectNovaTab, selectTabSlice } from '../../../store/slices/tabSlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import {
  DriveFileInfo,
  getDriveFiles,
  getLoadingFile,
  getLocalFiles,
  removeDriveFile,
  removeLocalFile,
  setDriveFiles,
  setLocalFiles
} from '../../../store/slices/uploadFiles';
import SelectBox from '../../selectBox';
import { FileUploader } from '../FileUploader';

import * as S from './style';
import { InputWrap } from './style';

export interface InputBarSubmitParam extends Pick<NovaChatType, 'input' | 'type'> {
  files?: File[] | DriveFileInfo[];
}

interface InputBarProps {
  novaHistory: NovaChatType[];
  disabled?: boolean;
  expiredNOVA?: boolean;
  onSubmit: (param: InputBarSubmitParam, isAnswer: boolean) => Promise<void>;
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
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
  const chatMode = useAppSelector(novaChatModeSelector);
  const serviceCredits = useAppSelector(selectAllServiceCredits);
  const {
    pastedImages,
    handleRemovePastedImages,
    pastedImagesAsFileType,
    handleClearPastedImages
  } = useClipboard();
  const [activatedUploadBtn, setActivatedUploadBtn] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputDocsFileRef = useRef<HTMLInputElement | null>(null);
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [contents]);

  useEffect(() => {
    if (expiredNOVA) {
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [expiredNOVA, dispatch]);

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

    dispatch(selectNovaTab(NOVA_TAB_TYPE.aiChat));
    await props.onSubmit(
      {
        input: contents,
        files: hasLocalFiles
          ? localFiles
          : hasDriveFiles
            ? driveFiles
            : hasPasteImages
              ? pastedImagesAsFileType
              : [],
        type: fileType
      },
      false
    );
    textAreaRef.current?.focus();
  };

  const UPLOAD_BTN_LIST = [
    {
      target: 'nova-file',
      accept: SUPPORT_DOCUMENT_TYPE,
      children: isLightMode ? <DocsIconLight /> : <DocsIconDark />,
      ref: inputDocsFileRef
    },
    {
      target: 'nova-image',
      accept: getValidExt(selectedNovaTab),
      children: isLightMode ? <ImagesIconLight /> : <ImagesIconDark />,
      ref: inputImgFileRef
    }
  ];

  const handleMoveChat = () => {
    if (
      chatMode === SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY ||
      chatMode === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
    ) {
      dispatch(selectNovaTab(NOVA_TAB_TYPE.perplexity));
    } else {
      dispatch(selectNovaTab(NOVA_TAB_TYPE.aiChat));
    }
  };

  return (
    <S.InputBarBase disabled={disabled || expiredNOVA}>
      {pastedImages.length > 0 && (
        <S.FileListViewer onWheel={handleWheel}>
          {pastedImages.map((file) => (
            <S.ClipboardItem key={file.id}>
              <Icon size={64} iconSrc={file.url} />
              {isLightMode ? (
                <DeleteLightIcon onClick={() => handleRemovePastedImages(file)} />
              ) : (
                <DeleteDarkIcon onClick={() => handleRemovePastedImages(file)} />
              )}
            </S.ClipboardItem>
          ))}
        </S.FileListViewer>
      )}
      {localFiles.length > 0 && (
        <S.FileListViewer onWheel={handleWheel}>
          {localFiles.map((file: File) => (
            <S.FileItem key={file.name}>
              <Icon size={28} iconSrc={getFileIcon(file.name)} />
              <span>{sliceFileName(file.name)}</span>
              {isLightMode ? (
                <DeleteLightIcon onClick={() => handleRemoveLocalFile(file)} />
              ) : (
                <DeleteDarkIcon onClick={() => handleRemoveLocalFile(file)} />
              )}
            </S.FileItem>
          ))}
        </S.FileListViewer>
      )}
      {driveFiles.length > 0 && (
        <S.FileListViewer onWheel={handleWheel}>
          {driveFiles.map((file: DriveFileInfo) => (
            <S.FileItem key={file.name}>
              <Icon size={28} iconSrc={getFileIcon(file.name)} />
              <span>{sliceFileName(file.name)}</span>
              {isLightMode ? (
                <DeleteLightIcon onClick={() => handleRemoveDriveFile(file)} />
              ) : (
                <DeleteDarkIcon onClick={() => handleRemoveDriveFile(file)} />
              )}
            </S.FileItem>
          ))}
        </S.FileListViewer>
      )}
      {loadingFile.id !== '' && (
        <S.FileListViewer onWheel={handleWheel}>
          <S.FileItem>
            <Icon size={21} iconSrc={LoadingSpinner} />
            <span className="uploading">{t(`Nova.aiChat.Uploading`)}</span>
          </S.FileItem>
        </S.FileListViewer>
      )}
      <S.InputTxtWrapper hasValue={!!contents}>
        {selectedNovaTab === NOVA_TAB_TYPE.home && (
          <S.PromptWrap>
            {props.novaHistory.length <= 0 ? (
              <Swiper
                slidesPerView={'auto'}
                spaceBetween={6}
                pagination={{ clickable: true }}
                modules={[Pagination]}>
                {getMenuItemsFromServiceGroup(serviceCredits, isLightMode, t)
                  .filter((item) => item.key === chatMode)
                  .flatMap(() =>
                    Array.from({ length: 3 }, (_, i) => {
                      const prompt = t(
                        `Nova.ChatModel.${getChatGroupKey(chatMode)}.prompt${i + 1}`
                      );
                      return (
                        <SwiperSlide key={prompt} onClick={() => setContents(prompt)}>
                          {prompt}
                        </SwiperSlide>
                      );
                    })
                  )}
              </Swiper>
            ) : (
              <S.NovaRecentChat onClick={handleMoveChat}>
                <img src={isLightMode ? NovaLogoLightIcon : NovaLogoDarkIcon} alt="logo" />
                <span>NOVA와의 최근 대화</span>
              </S.NovaRecentChat>
            )}
          </S.PromptWrap>
        )}
        <InputWrap>
          {chatMode === SERVICE_TYPE.NOVA_CHAT_GPT4O &&
            selectedNovaTab === NOVA_TAB_TYPE.aiChat &&
            props.novaHistory.length > 0 && (
              <S.DocButtonWrap>
                {activatedUploadBtn ? (
                  UPLOAD_BTN_LIST.map((btn) => (
                    <FileUploader
                      key={btn.target}
                      target={btn.target}
                      accept={btn.accept}
                      inputRef={btn.ref}
                      tooltipStyle={{ padding: '12px 16px' }}
                      onClearPastedImages={handleClearPastedImages}>
                      {btn.children}
                    </FileUploader>
                  ))
                ) : (
                  <Icon
                    iconSrc={isLightMode ? PlusCircleLightIcon : PlusCircleDarkIcon}
                    size={24}
                    onClick={handleActiveUploadBtn}
                  />
                )}
              </S.DocButtonWrap>
            )}

          <S.TextAreaWrap>
            <S.TextArea
              placeholder={t(`Nova.ActionWindow.Placeholder`)!}
              value={contents}
              onChange={handleChange}
              maxLength={1000}
              ref={textAreaRef}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (isMobile) {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    if (contents.length > 0) {
                      handleOnClick();
                    } else {
                      e.preventDefault();
                    }
                  }
                } else {
                  const isComposing = e.nativeEvent.isComposing;

                  if (e.key === 'Enter' && e.shiftKey) {
                    return;
                  }

                  if (e.key === 'Enter' && !isComposing) {
                    if (contents.length > 0) {
                      handleOnClick();
                    } else {
                      e.preventDefault();
                    }
                  }
                }
              }}
              onFocus={() => {
                handleInActiveUploadBtn();
              }}
              onPaste={(e: React.ClipboardEvent<HTMLTextAreaElement>) => {
                // 클립보드에 이미지 파일이 있는 경우 텍스트 붙여넣기 방지
                const hasImageFile = Array.from(e.clipboardData.items).some((item) =>
                  item.type.startsWith('image/')
                );
                if (hasImageFile) {
                  e.preventDefault();
                }
              }}
            />
            <IconButton
              width={32}
              height={32}
              disable={contents.length < 1}
              onClick={handleOnClick}
              iconSize="lg"
              iconComponent={
                contents.length < 1
                  ? isLightMode
                    ? SendDisabledLightIcon
                    : SendDisabledDarkIcon
                  : isLightMode
                    ? SendActiveLightIcon
                    : SendActiveDarkIcon
              }
              cssExt={css`
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 8px;
                opacity: 1;
                padding: 0;
              `}
            />
          </S.TextAreaWrap>
        </InputWrap>
        <S.ButtonWrap>
          {selectedNovaTab === NOVA_TAB_TYPE.home && (
            <SelectBox
              menuItem={getMenuItemsFromServiceGroup(serviceCredits, isLightMode, t)}
              minWidth={290}
              paddingX={4}
              paddingY={4}
              selectedItem={chatMode}
              setSelectedItem={(item: string) => {
                dispatch(setChatMode(item.toUpperCase() as SERVICE_TYPE));
                if (selectedNovaTab !== NOVA_TAB_TYPE.home) {
                  if (
                    (item as SERVICE_TYPE) === SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY ||
                    (item as SERVICE_TYPE) === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
                  ) {
                    dispatch(selectNovaTab(NOVA_TAB_TYPE.perplexity));
                  } else {
                    dispatch(selectNovaTab(NOVA_TAB_TYPE.aiChat));
                  }
                }
              }}
              selectBoxCssExt={css`
                border: 1px solid ${isLightMode ? 'var(--gray-gray-30)' : 'var(--gray-gray-87)'};
              `}
              innerBoxCssExt={css`
                min-height: 58px;
                padding: 8px 16px 8px 8px;
              `}
            />
          )}
          {chatMode === SERVICE_TYPE.NOVA_CHAT_GPT4O && selectedNovaTab === NOVA_TAB_TYPE.home && (
            <S.DocButtonWrap>
              {UPLOAD_BTN_LIST.map((btn) => (
                <FileUploader
                  key={btn.target}
                  target={btn.target}
                  accept={btn.accept}
                  inputRef={btn.ref}
                  tooltipStyle={{ padding: '12px 16px' }}
                  onClearPastedImages={handleClearPastedImages}>
                  {btn.children}
                </FileUploader>
              ))}
            </S.DocButtonWrap>
          )}
        </S.ButtonWrap>
      </S.InputTxtWrapper>
    </S.InputBarBase>
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
