import React, { Suspense, useEffect, useRef, useState } from 'react';
import { apiWrapper } from 'api/apiWrapper';
import { PO_DRIVE_DOC_OPEN_STATUS } from 'api/constant';
import { useConfirm } from 'components/Confirm';
import { useChatNova } from 'components/hooks/useChatNova';
import useErrorHandle from 'components/hooks/useErrorHandle';
import { useShowCreditToast } from 'components/hooks/useShowCreditToast';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { appStateSelector } from 'store/slices/appState';
import { NovaFileInfo, novaHistorySelector } from 'store/slices/novaHistorySlice';
import { useAppDispatch, useAppSelector } from 'store/store';
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
  const location = useLocation();
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { novaExpireTime } = useAppSelector(appStateSelector);
  const { t } = useTranslation();
  const confirm = useConfirm();
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const chatNova = useChatNova();
  const expireTimer = useRef<NodeJS.Timeout | null>(null);

  const chatListRef = useRef<HTMLDivElement>(null);
  const [expiredNOVA, setExpiredNOVA] = useState<boolean>(false);

  const { handleDragOver, handleDragLeave, handleDrop } = useFileDrop();
  const { loadLocalFile } = useManageFile();

  const requestor = useRef<ReturnType<typeof apiWrapper>>();

  const checkDocStatus = async (files: NovaFileInfo[]) => {
    const promises = files.map(async (file) => {
      try {
        requestor.current = apiWrapper();
        const { res } = await requestor.current.request(PO_DRIVE_DOC_OPEN_STATUS, {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fileId: file.fileId, fileRevision: file.fileRevision }),
          method: 'POST'
        });
        const json = await res.json();
        const {
          success,
          data: { status }
        } = json;

        if (!success) throw new Error('Invalid File');
        return { ...file, valid: status };
      } catch (err) {
        throw new Error('Failed to handle file status');
      }
    });
    return await Promise.all(promises);
  };

  useEffect(() => {
    if (expiredNOVA) {
      confirm({
        title: '',
        msg: t('Nova.Alert.ExpiredNOVA'),
        onOk: {
          text: t(`Confirm`),
          callback: () => {
            setExpiredNOVA(false);
            chatNova.newChat();
          }
        }
      });
    }
  }, [expiredNOVA, t, confirm, chatNova]);

  return (
    <Wrapper>
      <NovaHeader />
      <Body
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, loadLocalFile)}>
        <AIChat expiredNOVA={expiredNOVA} setExpiredNOVA={setExpiredNOVA} />
      </Body>

      <Suspense fallback={<Overlay />}>
        <Modals />
      </Suspense>
    </Wrapper>
  );
}
