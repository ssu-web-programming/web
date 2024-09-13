import { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import useManageFile from '../../components/hooks/nova/useManageFile';
import useFileDrop from '../../components/hooks/useFileDrop';
import NovaHeader from '../../components/nova/Header';
import Modals, { Overlay } from '../../components/nova/modals/Modals';
import Tabs from '../../components/nova/Tabs';
import { NOVA_TAB_TYPE, selectNovaTab, selectTabSlice } from '../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../store/slices/uploadFiles';
import { useAppSelector } from '../../store/store';
import Bridge from '../../util/bridge';

import AIChat from './AIChat';
import ChangeBG from './ChangeBG';
import ChangeStyle from './ChangeStyle';
import ExpandImg from './ExpandImg';
import ImprovedRes from './ImprovedRes';
import RemakeImg from './RemakeImg';
import RemoveBG from './RemoveBG';

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
  const dispatch = useDispatch();
  const { handleDragOver, handleDragLeave, handleDrop } = useFileDrop();
  const { loadLocalFile } = useManageFile();
  const { usingAI, selectedNovaTab } = useAppSelector(selectTabSlice);
  const tabValues: NOVA_TAB_TYPE[] = Object.values(NOVA_TAB_TYPE);
  const isTabSelected = (tab: NOVA_TAB_TYPE) => selectedNovaTab === tab;

  const handleChangeTab = (selectTab: NOVA_TAB_TYPE) => {
    dispatch(selectNovaTab(selectTab));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));

    Bridge.callBridgeApi('curNovaTab', selectTab);
  };

  useEffect(() => {
    console.log(usingAI);
  }, [usingAI]);

  return (
    <Wrapper>
      <NovaHeader />
      {/*status === 'home' 추가하기*/}
      {!usingAI && (
        <Tabs tabs={tabValues} activeTab={selectedNovaTab} onChangeTab={handleChangeTab} />
      )}
      <Body
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, loadLocalFile)}>
        {isTabSelected(NOVA_TAB_TYPE.aiChat) && <AIChat />}
        {isTabSelected(NOVA_TAB_TYPE.removeBG) && <RemoveBG />}
        {isTabSelected(NOVA_TAB_TYPE.changeBG) && <ChangeBG />}
        {isTabSelected(NOVA_TAB_TYPE.remakeImg) && <RemakeImg />}
        {isTabSelected(NOVA_TAB_TYPE.expandImg) && <ExpandImg />}
        {isTabSelected(NOVA_TAB_TYPE.improvedRes) && <ImprovedRes />}
        {isTabSelected(NOVA_TAB_TYPE.changeStyle) && <ChangeStyle />}
      </Body>
      <Suspense fallback={<Overlay />}>
        <Modals />
      </Suspense>
    </Wrapper>
  );
}
