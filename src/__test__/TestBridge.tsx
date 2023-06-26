import styled from 'styled-components';
import Wrapper from '../components/Wrapper';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { selectBridgeMessage, setBridgeMessage } from '../store/slices/bridge';
import { flex, flexColumn, flexGrow, flexShrink } from '../style/cssCommon';
import { activeToast } from '../store/slices/toastSlice';
import NoCredit from '../components/toast/contents/NoCredit';

const Body = styled.div`
  ${flex}
  ${flexColumn}
  
  width: 100%;
  height: 100%;
  border: solid 1px gray;

  padding: 10px 10px 0px 10px;
  gap: 10px;
  box-sizing: border-box;
`;

const TestButton = styled.button`
  height: 40px;
`;

const Result = styled.div`
  ${flex}
  ${flexColumn}
  ${flexGrow}
  ${flexShrink}

  border: solid 1px gray;
  box-sizing: border-box;

  padding: 10px;

  overflow: auto;
`;

const Row = styled.div`
  ${flex}
  gap: 10px;
  overflow-y: hidden;
  overflow-x: auto;
  padding-bottom: 12px;
  box-sizing: border-box;
`;

// interface BridgeMessage {
//   cmd: string;
//   type: string;
//   body: string;
// }

declare global {
  var _Bridge: any;
  var fileToString: any;
}

export default function AITest() {
  const dispatch = useAppDispatch();
  const bridgeSelector = useAppSelector(selectBridgeMessage);

  const writeLog = useCallback((text: string) => {
    dispatch(setBridgeMessage({ cmd: 'call api', body: text }));
  }, []);

  const onToastLink = () => {
    dispatch(
      activeToast({
        active: true,
        msg: <NoCredit></NoCredit>,
        isError: true
      })
    );
  };

  const onInsertText = () => {
    try {
      const text = 'hello world!!';
      window._Bridge.insertText(text);
      writeLog(`call insertText : ${text}`);
    } catch (err) {
      writeLog(JSON.stringify(err));
    }
  };

  const onInsertHtml = () => {
    try {
      const html = '<p>hello</p><h1>월드123!!</h1>';
      window._Bridge.insertHtml(html);
      writeLog(`call insertHtml : ${html}`);
    } catch (err) {
      writeLog(JSON.stringify(err));
    }
  };

  const getBlob = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return blob;
    } catch (err) {
      throw err;
    }
  };

  const onDownloadImage = async () => {
    try {
      const blob = await getBlob('./bo.png');
      window._Bridge.downloadImage(blob);
      writeLog(`call onDownloadImage : ${await window.fileToString(blob)}`);
    } catch (err) {
      writeLog(JSON.stringify(err));
    }
  };

  const onInsertImage = async () => {
    try {
      const blob = await getBlob('./bo.png');
      window._Bridge.insertImage(blob);
      writeLog(`call onInsertImage : ${await window.fileToString(blob)}`);
    } catch (err) {
      writeLog(JSON.stringify(err));
    }
  };

  const onOpenDoc = async () => {
    try {
      const blob = await getBlob('./test.pptx');
      window._Bridge.openDoc(blob);
      writeLog(`call onOpenDoc : type(${blob.type}), size(${blob.size})`);
    } catch (err) {
      writeLog(JSON.stringify(err));
    }
  };

  const onClosePanel = () => {
    try {
      window._Bridge.closePanel('');
      writeLog(`call closePanel`);
    } catch (err) {
      writeLog(JSON.stringify(err));
    }
  };

  return (
    <Wrapper>
      <Body>
        <Result>
          {bridgeSelector.map((item, index) => (
            <div key={index} style={{ width: '100%', wordBreak: 'break-all' }}>
              {`cmd : ${item.cmd} / body : ${item.body}`}
            </div>
          ))}
        </Result>
        <Row>
          <TestButton onClick={onToastLink}>toastLink</TestButton>
          <TestButton onClick={onInsertText}>insertText</TestButton>
          <TestButton onClick={onInsertHtml}>insertHtml</TestButton>
          <TestButton onClick={onDownloadImage}>downloadImage</TestButton>
          <TestButton onClick={onInsertImage}>insertImage</TestButton>
          <TestButton onClick={onOpenDoc}>openDoc</TestButton>
          <TestButton onClick={onClosePanel}>closePanel</TestButton>
        </Row>
      </Body>
    </Wrapper>
  );
}
