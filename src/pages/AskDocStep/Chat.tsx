import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../store/store';
import { v4 as uuidv4 } from 'uuid';
import { ChatList } from '../../components/askDoc/ChatList';
import { ChatBottom } from '../../components/askDoc/ChatBottom';

import { TableCss, flexColumn, justiSpaceBetween, flex } from '../../style/cssCommon';
import { AskDocChat, removeChat, selectAskDoc } from '../../store/slices/askDoc';
import { summarySelector } from '../../store/slices/askDocSummary';
import { filesSelector } from '../../store/slices/askDocAnalyzeFiesSlice';
import { useChatAskdoc } from '../../components/hooks/useChatAskdoc';

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${justiSpaceBetween}
  
  width: 100%;
  height: 100%;
  background-color: var(--ai-purple-99-bg-light);

  ${TableCss}
`;

const WrapperPage = styled.div`
  ${flex}
  ${flexColumn}
  
  width: 100%;
  height: 100%;
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

const AskDoc = () => {
  const submitAskDoc = useChatAskdoc();
  const { askDocHistory: chatHistory } = useAppSelector(selectAskDoc);
  const { fileStatus } = useAppSelector(filesSelector);
  const { questions } = useAppSelector(summarySelector);
  const [userChatText, setUserChatText] = useState('');

  const [isActiveInput, setIsActiveInput] = useState<boolean>(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeRetry, setActiveRetry] = useState<boolean>(false);
  const stopRef = useRef<AskDocChat['id'][]>([]);

  useEffect(() => {
    if (fileStatus != 'AVAILABLE') return;
    if (questions.length > 0) return;

    setLoadingId(null);
    setIsActiveInput(true);
    setActiveRetry(false);
  }, []);

  const onSubmitAskdocChat = async (api: 'gpt' | 'askDoc', chatText?: string) => {
    const assistantId = uuidv4();
    const userId = uuidv4();

    setLoadingId(assistantId);
    setActiveRetry(false);

    try {
      await submitAskDoc.submitChat(api, assistantId, userId, userChatText, stopRef, chatText);

      setUserChatText('');
      setLoadingId(null);
    } catch (error: any) {
      setIsActiveInput(true);
      setLoadingId(null);
    }
  };

  return (
    <WrapperPage>
      <Body>
        <Wrapper>
          <ChatList
            loadingId={loadingId}
            setLoadingId={setLoadingId}
            isActiveRetry={activeRetry}
            isIncludeSummary={true}
            setIsActiveInput={setIsActiveInput}
            handleClickQuestion={onSubmitAskdocChat}
            stopRef={stopRef}
          />
          <ChatBottom
            loadingId={loadingId}
            isActiveInput={isActiveInput}
            setIsActiveInput={setIsActiveInput}
            chatInput={userChatText}
            onSubmitAskdocChat={onSubmitAskdocChat}
            setChatInput={setUserChatText}
          />
        </Wrapper>
      </Body>
    </WrapperPage>
  );
};

export default AskDoc;
