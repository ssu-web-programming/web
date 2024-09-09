import React, { Suspense } from 'react';
import styled from 'styled-components';

import useManageFile from '../../components/hooks/nova/useManageFile';
import useFileDrop from '../../components/hooks/useFileDrop';
import NovaHeader from '../../components/nova/Header';
import Modals, { Overlay } from '../../components/nova/modals/Modals';

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
  const { handleDragOver, handleDragLeave, handleDrop } = useFileDrop();
  const { loadLocalFile } = useManageFile();

  return (
    <Wrapper>
      <NovaHeader />
      <Body
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, loadLocalFile)}>
        <AIChat />
      </Body>

      <Suspense fallback={<Overlay />}>
        <Modals />
      </Suspense>
    </Wrapper>
  );
}
