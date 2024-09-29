import React, { Suspense, useCallback, useEffect } from 'react';
import { FileRejection, FileWithPath, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CustomScrollbar } from 'style/cssCommon';
import styled from 'styled-components';
import { useConfirm } from '../../components/Confirm';
import { useChangeBackground } from '../../components/hooks/nova/useChangeBackground';
import { useChangeStyle } from '../../components/hooks/nova/useChangeStyle';
import { useExpandImage } from '../../components/hooks/nova/useExpandImage';
import { useImprovedResolution } from '../../components/hooks/nova/useImprovedResolution';
import useNovaAnnouncement from '../../components/hooks/nova/useNovaAnnouncement';
import { useRemakeImage } from '../../components/hooks/nova/useRemakeImage';
import { useRemoveBackground } from '../../components/hooks/nova/useRemoveBackground';
import useFileDrop from '../../components/hooks/useFileDrop';
import useUserInfoUtils from '../../components/hooks/useUserInfoUtils';
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
import { announceInfoSelector } from '../../store/slices/nova/announceSlice';
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
  ${CustomScrollbar};
  background: rgb(244, 246, 248);
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
  const { calcAvailableFileCnt } = useUserInfoUtils();
  const { usingAI, selectedNovaTab } = useAppSelector(selectTabSlice);
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
  const { setAnnouncementInfo } = useNovaAnnouncement();
  const announceInfo = useAppSelector(announceInfoSelector(selectedNovaTab));
  const tabValues: NOVA_TAB_TYPE[] = Object.values(NOVA_TAB_TYPE);
  const { handleDrop } = useFileDrop();

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      if (selectedNovaTab !== NOVA_TAB_TYPE.aiChat && status != 'home') return;

      handleDrop(acceptedFiles, fileRejections);
    },
    [confirm, t]
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    maxFiles: calcAvailableFileCnt()
  });

  const handleChangeTab = (selectTab: NOVA_TAB_TYPE) => {
    dispatch(selectNovaTab(selectTab));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));

    Bridge.callBridgeApi('curNovaTab', selectTab);
  };

  useEffect(() => {}, [usingAI, status]);
  useEffect(() => {
    if (announceInfo.type != '' && !announceInfo.isShow) return;

    setAnnouncementInfo(selectedNovaTab);
  }, [selectedNovaTab]);

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
