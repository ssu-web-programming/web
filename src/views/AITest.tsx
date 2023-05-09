import styled from 'styled-components';
import Wrapper from '../components/Wrapper';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../store/store';
import { selectBridgeMessage } from '../store/slices/bridge';

const Body = styled.div`
  width: 100%;
  height: 100%;
  border: solid 1px gray;
  display: flex;
  flex-direction: column;

  padding: 10px 10px 0px 10px;
  gap: 10px;
  box-sizing: border-box;
`;

const TestButton = styled.button`
  height: 40px;
`;

const Result = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  border: solid 1px gray;
  box-sizing: border-box;

  padding: 10px;

  overflow: auto;
`;

const Row = styled.div`
  display: flex;
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
  const bridgeSelector = useAppSelector(selectBridgeMessage);
  const [log, setLog] = useState<string[]>([]);

  const writeLog = useCallback((text: string) => {
    setLog((prev) => [...prev, text]);
  }, []);

  useEffect(() => {
    if (bridgeSelector.cmd && bridgeSelector.cmd !== '')
      setLog((prev) => [
        ...prev,
        `=== called receiveMessage : ${bridgeSelector.cmd} / ${bridgeSelector.body}`
      ]);
  }, [bridgeSelector]);

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
      writeLog(`call onOpenDoc : ${await window.fileToString(blob)}`);
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
          {log.map((item, index) => (
            <div key={index} style={{ width: '100%', wordBreak: 'break-all' }}>
              {item}
            </div>
          ))}
        </Result>
        <Row>
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
