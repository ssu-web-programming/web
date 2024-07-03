import styled from 'styled-components';
import InputBar, { InputBarSubmitParam } from 'components/nova/InputBar';
import { useAppDispatch, useAppSelector } from 'store/store';
import {
  pushChat,
  initNovaHistory,
  novaHistorySelector,
  appendChatOutput,
  addChatOutputRes,
  updateChatStatus
} from 'store/slices/novaHistorySlice';
import { apiWrapper, streaming } from 'api/apiWrapper';
import { v4 } from 'uuid';
import PreMarkdown from 'components/PreMarkdown';
import { NOVA_CHAT_API } from 'api/constant';
import { markdownToHtml } from 'util/common';
import { load } from 'cheerio';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Wrapper = styled(Container)`
  flex-direction: column;
  justify-content: flex-start;
`;

const Header = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-between;
  padding: 0px 16px;
  color: var(--ai-purple-50-main);

  div {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 8px;
  }
`;

const Body = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Entry = styled(Container)`
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background-color: #f4f6f8;
  overflow-y: auto;
`;

const ChatList = styled(Container)`
  flex-direction: column;
  padding: 24px 16px;

  background-color: var(--gray-gray-10);
  overflow-y: auto;
`;

const ChatItem = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;

  & > div {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-start;
    align-items: flex-start;
  }

  & + & {
    margin-top: 30px;
  }
`;

export default function Nova() {
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);

  const onSubmit = async (submitParam: InputBarSubmitParam) => {
    const id = v4();
    let result = '';
    try {
      const lastChat = novaHistory[novaHistory.length - 1];
      const { vsId = '', threadId = '' } = lastChat || {};
      const { input, files = [] } = submitParam;
      const formData = new FormData();
      for (const file of files) {
        formData.append('uploadFiles', file);
      }

      const type = ''; // TODO : check
      const role = 'user';

      formData.append('content', input);
      formData.append('role', role);
      formData.append('type', type);
      formData.append('vsId', vsId);
      formData.append('threadId', threadId);

      dispatch(pushChat({ id, input, type, role, vsId, threadId, output: '' }));

      const { res } = await apiWrapper().request(NOVA_CHAT_API, {
        headers: {},
        body: formData,
        method: 'POST'
      });

      const resVsId = res.headers.get('vsId') || '';
      const resThreadId = res.headers.get('threadId') || '';

      await streaming(res, (contents) => {
        dispatch(
          appendChatOutput({
            id,
            output: contents,
            vsId: resVsId,
            threadId: resThreadId
          })
        );
        result += contents;
      });
      dispatch(updateChatStatus({ id, status: 'done' }));
    } catch (err) {
      console.log(err);
    } finally {
      const html = await markdownToHtml(result);
      if (html) {
        const $ = load(html);
        const $image = $('img');
        if ($image.length > 0) {
          const image = $image[0] as cheerio.TagElement;
          dispatch(addChatOutputRes({ id, res: image.attribs.src }));
        }
      }
    }
  };

  const newChat = () => dispatch(initNovaHistory());

  return (
    <Wrapper>
      <Header>
        <div>
          <p>Logo</p>
          <p>NOVA</p>
        </div>
        <div>
          <button onClick={newChat}>new</button>
          <button>credit</button>
        </div>
      </Header>
      <Body>
        {novaHistory.length < 1 ? (
          <Entry>
            <div>똑똑한 AI에게 무엇이든 물어보세요.</div>
            <div>문서를 첨부하면 채팅으로 주요 내용을 빠르게 파악할 수 있어요</div>
            <button>24.03.04에 작성한 회의록 찾아줘</button>
            <button>기획자 면접 예상질문 뽑아줘</button>
            <button>이미지 배경제거 하는 법 알려줘</button>
            <div>제공한 답이 정확하지 않을 수 있으니 정보의 사실 여부를 확인해 주세요.</div>
          </Entry>
        ) : (
          <ChatList
            ref={(el) => {
              if (el) el.scrollTo(0, el.scrollHeight);
            }}>
            {novaHistory.map((item) => (
              <ChatItem key={item.id}>
                <div>
                  <div>User</div>
                  {item.input}
                </div>
                <div>
                  <div>AI</div>
                  {item.status === 'request' ? (
                    <div>Loading...</div>
                  ) : (
                    <PreMarkdown text={item.output}></PreMarkdown>
                  )}
                </div>
                {item.res && (
                  <div>
                    <button>down</button>
                  </div>
                )}
              </ChatItem>
            ))}
          </ChatList>
        )}
      </Body>
      <InputBar onSubmit={onSubmit}></InputBar>
    </Wrapper>
  );
}
