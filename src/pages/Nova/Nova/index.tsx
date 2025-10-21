import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import Announcement from '../../../components/Announcement';
import { useConfirm } from '../../../components/Confirm';
import { useChangeBackground } from '../../../components/hooks/nova/useChangeBackground';
import { useChangeStyle } from '../../../components/hooks/nova/useChangeStyle';
import { useConvert2DTo3D } from '../../../components/hooks/nova/useConvert2DTo3D';
import { useExpandImage } from '../../../components/hooks/nova/useExpandImage';
import { useImprovedResolution } from '../../../components/hooks/nova/useImprovedResolution';
import useManageFile from '../../../components/hooks/nova/useManageFile';
import usePrivacyConsent from '../../../components/hooks/nova/usePrivacyConsent';
import { useRemakeImage } from '../../../components/hooks/nova/useRemakeImage';
import { useRemoveBackground } from '../../../components/hooks/nova/useRemoveBackground';
import useSubmitHandler from '../../../components/hooks/nova/useSubmitHandler';
import useShowConfirmModal from '../../../components/hooks/use-show-confirm-modal';
import { useChatNova } from '../../../components/hooks/useChatNova';
import ImageUploadGuide from '../../../components/image-upload-guide';
import AIChat from '../../../components/nova/aiChat';
import AIVideo from '../../../components/nova/aiVideo';
import Banner from '../../../components/nova/banner';
import Convert from '../../../components/nova/Convert';
import Expand from '../../../components/nova/Expand';
import { Guide } from '../../../components/nova/Guide';
import NovaHeader from '../../../components/nova/Header';
import NovaHome from '../../../components/nova/home/homeLayout';
import Loading from '../../../components/nova/Loading';
import Modals, { Overlay } from '../../../components/nova/modals/Modals';
import Progress from '../../../components/nova/Progress';
import Prompt from '../../../components/nova/Prompt';
import Result from '../../../components/nova/result/index';
import StyleStudio from '../../../components/nova/styleStudio';
import Theme from '../../../components/nova/Theme';
import TimeOut from '../../../components/nova/timeout';
import Uploading from '../../../components/nova/uploading';
import { FileUploadState } from '../../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { SERVICE_TYPE } from '../../../constants/serviceType';
import LockAndKeyIcon from '../../../img/common/lock_and_key.png';
import { appStateSelector } from '../../../store/slices/appState';
import { announceInfoSelector } from '../../../store/slices/nova/announceSlice';
import {
  novaChatModeSelector,
  novaHistorySelector,
  setIsShareMode
} from '../../../store/slices/nova/novaHistorySlice';
import {
  resetPageData,
  selectPageService,
  selectPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import Translation from '../Translation';
import VoiceDictation from '../VoiceDictation';

import * as S from './style';
import Bridge from '../../../util/bridge';

export type ClientStatusType = 'home' | 'doc_edit_mode' | 'doc_view_mode';

export default function Nova() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { isNotLogin } = useAppSelector(appStateSelector);
  const announcementList = useAppSelector(announceInfoSelector);
  const { goConvertPage } = useConvert2DTo3D();
  const { goPromptPage } = useChangeBackground();
  const { handleRemoveBackground } = useRemoveBackground();
  const { handleRemakeImage } = useRemakeImage();
  const { goExpandPage } = useExpandImage();
  const { handleImprovedResolution } = useImprovedResolution();
  const { goThemePage } = useChangeStyle();
  const { handleAgreement } = usePrivacyConsent();
  const { loadLocalFile, uploadTranslationFile } = useManageFile();
  const chatNova = useChatNova();
  const showConfirmModal = useShowConfirmModal();
  const [expiredNOVA, setExpiredNOVA] = useState<boolean>(false);
  const [fileUploadState, setFileUploadState] = useState<FileUploadState>({
    type: '',
    state: 'ready',
    progress: 0
  });
  const { createChatSubmitHandler } = useSubmitHandler({
    setFileUploadState,
    setExpiredNOVA
  });
  const { usingAI, selectedNovaTab } = useAppSelector(selectTabSlice);
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const chatMode = useAppSelector(novaChatModeSelector);
  const novaHistory = useAppSelector(novaHistorySelector);

  useEffect(() => {
    if (
      expiredNOVA &&
      (selectedNovaTab === NOVA_TAB_TYPE.home ||
        selectedNovaTab === NOVA_TAB_TYPE.aiChat ||
        selectedNovaTab === NOVA_TAB_TYPE.perplexity)
    ) {
      showConfirmModal({
        msg: t('Nova.Alert.ExpiredNOVA'),
        onOk: {
          text: t(`Confirm`),
          handleOk: () => {
            setExpiredNOVA(false);
            dispatch(setIsShareMode(false));
            chatNova.newChat(selectedNovaTab, novaHistory);
          }
        }
      });
    }
  }, [expiredNOVA, selectedNovaTab]);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      if (
        selectedNovaTab == NOVA_TAB_TYPE.perplexity ||
        (selectedNovaTab !== NOVA_TAB_TYPE.aiChat && status !== 'home') ||
        (selectedNovaTab === NOVA_TAB_TYPE.aiChat && chatMode !== SERVICE_TYPE.NOVA_CHAT_GPT4_1) ||
        (selectedNovaTab === NOVA_TAB_TYPE.home && chatMode !== SERVICE_TYPE.NOVA_CHAT_GPT4_1)
      ) {
        return;
      }
      if (!(await handleAgreement())) return;

      if (selectedNovaTab === NOVA_TAB_TYPE.translation) {
        await uploadTranslationFile(acceptedFiles, 30 * 1024 * 1024);
      } else {
        const files: File[] = acceptedFiles.map(
          (file) => new File([file], file.name, { type: file.type })
        );
        dispatch(resetPageData(selectedNovaTab));
        await loadLocalFile(files);
      }
    },
    [confirm, t]
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  useEffect(() => {}, [usingAI, status]);

  const renderContent = () => {
    const handleUploadComplete = async () => {
      if (status === 'saving') return;

      switch (selectedNovaTab) {
        case NOVA_TAB_TYPE.convert2DTo3D:
          await goConvertPage();
          break;
        case NOVA_TAB_TYPE.removeBG:
          await handleRemoveBackground();
          break;
        case NOVA_TAB_TYPE.changeBG:
          await goPromptPage();
          break;
        case NOVA_TAB_TYPE.remakeImg:
          await handleRemakeImage();
          break;
        case NOVA_TAB_TYPE.expandImg:
          await goExpandPage();
          break;
        case NOVA_TAB_TYPE.improvedRes:
          await handleImprovedResolution();
          break;
        case NOVA_TAB_TYPE.changeStyle:
          await goThemePage();
          break;
        default:
          return async () => {};
      }
    };

    if (selectedNovaTab == NOVA_TAB_TYPE.home) {
      return (
        <NovaHome
          expiredNOVA={expiredNOVA}
          setExpiredNOVA={setExpiredNOVA}
          createChatSubmitHandler={(submitParam) => createChatSubmitHandler(submitParam, false)}
          fileUploadState={fileUploadState}
        />
      );
    } else if (
      selectedNovaTab === NOVA_TAB_TYPE.aiChat ||
      selectedNovaTab === NOVA_TAB_TYPE.perplexity
    ) {
      return (
        <>
          {status === 'progress' && <Progress />}
          <AIChat
            expiredNOVA={expiredNOVA}
            setExpiredNOVA={setExpiredNOVA}
            createChatSubmitHandler={(submitParam, isAnswer, chatType: SERVICE_TYPE) =>
              createChatSubmitHandler(submitParam, isAnswer, chatType)
            }
            fileUploadState={fileUploadState}
          />
        </>
      );
    } else if (selectedNovaTab === NOVA_TAB_TYPE.aiVideo) {
      return <AIVideo />;
    } else if (selectedNovaTab === NOVA_TAB_TYPE.translation) {
      return <Translation />;
    } else if (selectedNovaTab === NOVA_TAB_TYPE.voiceDictation) {
      return <VoiceDictation />;
    } else {
      switch (status) {
        case 'home':
        case 'progress':
          if (selectedNovaTab === NOVA_TAB_TYPE.styleStudio) {
            return <StyleStudio />;
          } else {
            return (
              <Guide>
                <ImageUploadGuide handleUploadComplete={handleUploadComplete} />
              </Guide>
            );
          }
        case 'convert':
          return <Convert />;
        case 'prompt':
          return <Prompt />;
        case 'theme':
          return <Theme />;
        case 'expand':
          return <Expand />;
        case 'loading':
          return <Loading />;
        case 'done':
        case 'saving':
          return <Result />;
        case 'timeout':
          return <TimeOut />;
        default:
          return null;
      }
    }
  };

  return (
    <>
      {isNotLogin && (
        <S.Dim>
          <S.LoginWrap>
            <img src={LockAndKeyIcon} alt="lock_and_key" />
            <p
              dangerouslySetInnerHTML={{ __html: t('Nova.Home.requestLogin') || '' }}
              onClick={Bridge.callBridgeApi('requestLogin')}
            />
          </S.LoginWrap>
        </S.Dim>
      )}
      <S.Wrapper {...getRootProps()} isScroll={selectedNovaTab != NOVA_TAB_TYPE.aiChat}>
        {(usingAI || status === 'home') && isDragActive && <Uploading />}
        <NovaHeader />
        {(status === 'progress' || status === 'saving') && <Progress />}
        <S.Body isScroll={selectedNovaTab != NOVA_TAB_TYPE.voiceDictation}>
          {selectedNovaTab === NOVA_TAB_TYPE.home && <Banner />}
          {announcementList
            .filter(
              (info) =>
                (service.some((s) => s.serviceType === info.type) ||
                  (selectedNovaTab === NOVA_TAB_TYPE.home && info.type === 'PO_NOVA_MAIN')) &&
                info.status &&
                info.isShow
            )
            .map((info) => {
              return <Announcement key={info.id} announcement={info} />;
            })}
          {renderContent()}
        </S.Body>
        <Suspense fallback={<Overlay />}>
          <Modals />
        </Suspense>
      </S.Wrapper>
    </>
  );
}
