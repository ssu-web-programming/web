import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { useChangeBackground } from '../../components/hooks/nova/useChangeBackground';
import { useChangeStyle } from '../../components/hooks/nova/useChangeStyle';
import { useExpandImage } from '../../components/hooks/nova/useExpandImage';
import { useImprovedResolution } from '../../components/hooks/nova/useImprovedResolution';
import useManageFile from '../../components/hooks/nova/useManageFile';
import { useRemakeImage } from '../../components/hooks/nova/useRemakeImage';
import { useRemoveBackground } from '../../components/hooks/nova/useRemoveBackground';
import useFileDrop from '../../components/hooks/useFileDrop';
import Prompt from '../../components/nova/ChangeBGPrompt';
import Expand from '../../components/nova/Expand';
import { Guide } from '../../components/nova/Guide';
import NovaHeader from '../../components/nova/Header';
import ImageUploader from '../../components/nova/ImageUploader';
import Loading from '../../components/nova/Loading';
import Modals, { Overlay } from '../../components/nova/modals/Modals';
import Progress from '../../components/nova/Progress';
import Result from '../../components/nova/Result';
import Tabs from '../../components/nova/Tabs';
import Theme from '../../components/nova/Theme';
import TimeOut from '../../components/nova/TimeOut';
import { selectPageStatus } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectNovaTab, selectTabSlice } from '../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../store/slices/uploadFiles';
import { useAppSelector } from '../../store/store';
import Bridge from '../../util/bridge';

import AIChat from './AIChat';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Wrapper = styled(Container)`
  flex-direction: column;
  justify-content: flex-start;
`;

const Body = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  overflow-y: auto;
  background-color: rgb(244, 246, 248);
`;

export type ClientStatusType = 'home' | 'doc_edit_mode' | 'doc_view_mode';

export default function Nova() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { handleDragOver, handleDragLeave, handleDrop } = useFileDrop();
  const { goPromptPage } = useChangeBackground();
  const { handleRemoveBackground } = useRemoveBackground();
  const { handleRemakeImage } = useRemakeImage();
  const { goExpandPage } = useExpandImage();
  const { handleImprovedResolution } = useImprovedResolution();
  const { goThemePage } = useChangeStyle();
  const { loadLocalFile } = useManageFile();
  const { usingAI, selectedNovaTab } = useAppSelector(selectTabSlice);
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
  const tabValues: NOVA_TAB_TYPE[] = Object.values(NOVA_TAB_TYPE);

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
      return <AIChat />;
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
    <Wrapper>
      <NovaHeader />
      {!usingAI && status === 'home' && (
        <Tabs tabs={tabValues} activeTab={selectedNovaTab} onChangeTab={handleChangeTab} />
      )}
      <Body
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, loadLocalFile)}>
        {renderContent()}
      </Body>
      <Suspense fallback={<Overlay />}>
        <Modals />
      </Suspense>
    </Wrapper>
  );
}
