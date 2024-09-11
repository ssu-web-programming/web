import { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import useManageFile from '../../components/hooks/nova/useManageFile';
import useFileDrop from '../../components/hooks/useFileDrop';
import NovaHeader from '../../components/nova/Header';
import Modals, { Overlay } from '../../components/nova/modals/Modals';
import Tabs from '../../components/nova/Tabs';
import { NOVA_TAB_TYPE, selectNovaTab, selectTabSlice } from '../../store/slices/tabSlice';

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
  flex-direction: column;
  overflow-y: auto;

  position: relative;
`;

export type ClientStatusType = 'home' | 'doc_edit_mode' | 'doc_view_mode';

export default function Nova() {
  const dispatch = useDispatch();
  const { handleDragOver, handleDragLeave, handleDrop } = useFileDrop();
  const { loadLocalFile } = useManageFile();

  const currentTab = useSelector(selectTabSlice).selectedNovaTab;
  const tabValues: NOVA_TAB_TYPE[] = Object.values(NOVA_TAB_TYPE);
  const isTabSelected = (tab: NOVA_TAB_TYPE) => currentTab === tab;

  const handleChangeTab = (selectTab: NOVA_TAB_TYPE) => {
    dispatch(selectNovaTab(selectTab));
  };

  return (
    <Wrapper>
      <NovaHeader />
      <Tabs tabs={tabValues} activeTab={currentTab} onChangeTab={handleChangeTab} />
      <Body
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, loadLocalFile)}>
        {isTabSelected(NOVA_TAB_TYPE.aiChat) && <AIChat />}
      </Body>
      <Suspense fallback={<Overlay />}>
        <Modals />
      </Suspense>
    </Wrapper>
  );
}
