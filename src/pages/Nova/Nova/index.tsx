import { Suspense, useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

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
import { useChatNova } from '../../../components/hooks/useChatNova';
import AIChat from '../../../components/nova/aiChat';
import Convert from '../../../components/nova/Convert';
import Expand from '../../../components/nova/Expand';
import { Guide } from '../../../components/nova/Guide';
import NovaHeader from '../../../components/nova/Header';
import ImageUploader from '../../../components/nova/ImageUploader';
import Loading from '../../../components/nova/Loading';
import Modals, { Overlay } from '../../../components/nova/modals/Modals';
import NovaHome from '../../../components/nova/novaHome';
import Progress from '../../../components/nova/Progress';
import Prompt from '../../../components/nova/Prompt';
import Result from '../../../components/nova/Result';
import Theme from '../../../components/nova/Theme';
import TimeOut from '../../../components/nova/TimeOut';
import Uploading from '../../../components/nova/Uploading';
import { FileUploadState } from '../../../constants/fileTypes';
import { selectPageStatus } from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectNovaTab, selectTabSlice } from '../../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppSelector } from '../../../store/store';
import Bridge from '../../../util/bridge';

import * as S from './style';

export type ClientStatusType = 'home' | 'doc_edit_mode' | 'doc_view_mode';

export default function Nova() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { goConvertPage } = useConvert2DTo3D();
  const { goPromptPage } = useChangeBackground();
  const { handleRemoveBackground } = useRemoveBackground();
  const { handleRemakeImage } = useRemakeImage();
  const { goExpandPage } = useExpandImage();
  const { handleImprovedResolution } = useImprovedResolution();
  const { goThemePage } = useChangeStyle();
  const { usingAI, selectedNovaTab } = useAppSelector(selectTabSlice);
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
  const tabValues: NOVA_TAB_TYPE[] = Object.values(NOVA_TAB_TYPE);
  const { handleAgreement } = usePrivacyConsent();
  const { loadLocalFile } = useManageFile();

  const chatNova = useChatNova();
  const [expiredNOVA, setExpiredNOVA] = useState<boolean>(false);
  const [fileUploadState, setFileUploadState] = useState<FileUploadState>({
    type: '',
    state: 'ready',
    progress: 0
  });
  const { createNovaSubmitHandler } = useSubmitHandler({ setFileUploadState, setExpiredNOVA });

  useEffect(() => {
    if (expiredNOVA) {
      confirm({
        title: '',
        msg: t('Index.Alert.ExpiredNOVA'),
        onOk: {
          text: t(`Confirm`),
          callback: () => {
            setExpiredNOVA(false);
            chatNova.newChat();
          }
        }
      });
    }
  }, [expiredNOVA]);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      if (selectedNovaTab !== NOVA_TAB_TYPE.aiChat && status != 'home') return;
      if (!(await handleAgreement())) return;

      loadLocalFile(acceptedFiles);
    },
    [confirm, t]
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  const handleChangeTab = (selectTab: NOVA_TAB_TYPE) => {
    dispatch(selectNovaTab(selectTab));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));

    Bridge.callBridgeApi('curNovaTab', selectTab);
  };

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
          createNovaSubmitHandler={createNovaSubmitHandler}
          fileUploadState={fileUploadState}
        />
      );
    } else if (selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
      return (
        <>
          {status === 'progress' && <Progress />}
          <AIChat
            expiredNOVA={expiredNOVA}
            setExpiredNOVA={setExpiredNOVA}
            createNovaSubmitHandler={createNovaSubmitHandler}
            fileUploadState={fileUploadState}
          />
        </>
      );
    } else {
      switch (status) {
        case 'home':
        case 'progress':
          return (
            <Guide>
              <ImageUploader
                guideMsg={t(`Nova.${selectedNovaTab}.Guide.ImgUploader`)}
                handleUploadComplete={handleUploadComplete}
                curTab={selectedNovaTab}
              />
            </Guide>
          );
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
      <S.Wrapper {...getRootProps()} isScroll={selectedNovaTab != 'aiChat'}>
        {(usingAI || status === 'home') && isDragActive && <Uploading />}
        <NovaHeader />
        {(status === 'progress' || status === 'saving') && <Progress />}
        {/*{(status === 'home' || status === 'progress') &&*/}
        {/*  (selectedNovaTab !== NOVA_TAB_TYPE.aiChat || !usingAI) && (*/}
        {/*    <Tabs tabs={tabValues} activeTab={selectedNovaTab} onChangeTab={handleChangeTab} />*/}
        {/*  )}*/}
        <S.Body>{renderContent()}</S.Body>
        <Suspense fallback={<Overlay />}>
          <Modals />
        </Suspense>
      </S.Wrapper>
    </>
  );
}
