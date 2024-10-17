import React, { Suspense, useCallback, useEffect } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { useConfirm } from '../../components/Confirm';
import { useChangeBackground } from '../../components/hooks/nova/useChangeBackground';
import { useChangeStyle } from '../../components/hooks/nova/useChangeStyle';
import { useExpandImage } from '../../components/hooks/nova/useExpandImage';
import { useImprovedResolution } from '../../components/hooks/nova/useImprovedResolution';
import useManageFile from '../../components/hooks/nova/useManageFile';
import usePrivacyConsent from '../../components/hooks/nova/usePrivacyConsent';
import { useRemakeImage } from '../../components/hooks/nova/useRemakeImage';
import { useRemoveBackground } from '../../components/hooks/nova/useRemoveBackground';
import Expand from '../../components/nova/Expand';
import { Guide } from '../../components/nova/Guide';
import NovaHeader from '../../components/nova/Header';
import ImageUploader from '../../components/nova/ImageUploader';
import Loading from '../../components/nova/Loading';
import Modals, { Overlay } from '../../components/nova/modals/Modals';
import Progress from '../../components/nova/Progress';
import Prompt from '../../components/nova/Prompt';
import Result from '../../components/nova/Result';
import Tabs from '../../components/nova/Tabs';
import Theme from '../../components/nova/Theme';
import TimeOut from '../../components/nova/TimeOut';
import Uploading from '../../components/nova/Uploading';
import { selectPageStatus } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectNovaTab, selectTabSlice } from '../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../store/slices/uploadFiles';
import { useAppSelector } from '../../store/store';
import Bridge from '../../util/bridge';

import AIChat from './AIChat';

const Wrapper = styled.div<{ isScroll: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: rgb(244, 246, 248);
  overflow: hidden;

  scrollbar-color: #c9cdd2 #ffffff;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
    background: #ffffff;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #c9cdd2;
  }

  &::-webkit-scrollbar-track {
    border-radius: 4px;
    background: #ffffff;
  }
`;

const Body = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
`;

export type ClientStatusType = 'home' | 'doc_edit_mode' | 'doc_view_mode';

export default function Nova() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const confirm = useConfirm();
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
      switch (selectedNovaTab) {
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

    if (selectedNovaTab == NOVA_TAB_TYPE.aiChat) {
      return (
        <>
          {status === 'progress' && <Progress />}
          <AIChat />
        </>
      );
    } else {
      switch (status) {
        case 'home':
        case 'progress':
          return (
            <>
              {status === 'progress' && <Progress />}
              <Guide>
                <ImageUploader
                  guideMsg={t(`Nova.${selectedNovaTab}.Guide.ImgUploader`)}
                  handleUploadComplete={handleUploadComplete}
                  curTab={selectedNovaTab}
                />
              </Guide>
            </>
          );
        case 'prompt':
          return <Prompt />;
        case 'theme':
          return <Theme />;
        case 'expand':
          return <Expand />;
        case 'loading':
          return <Loading />;
        case 'done':
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
      <Wrapper {...getRootProps()} isScroll={selectedNovaTab != 'aiChat'}>
        {(usingAI || status === 'home') && isDragActive && <Uploading />}
        <NovaHeader />
        {!usingAI && (status === 'home' || status === 'progress') && (
          <Tabs tabs={tabValues} activeTab={selectedNovaTab} onChangeTab={handleChangeTab} />
        )}
        <Body>{renderContent()}</Body>
        <Suspense fallback={<Overlay />}>
          <Modals />
        </Suspense>
      </Wrapper>
    </>
  );
}
