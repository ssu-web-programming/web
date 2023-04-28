import styled from 'styled-components';
import Wrapper from '../components/Wrapper';
import { useState } from 'react';

const Body = styled.div`
  width: 100%;
  height: 100%;
  border: solid 1px gray;
  display: flex;
  flex-direction: column;

  padding: 10px;
  gap: 10px;
  box-sizing: border-box;
`;

const TestButton = styled.button`
  width: 100px;
  height: 60px;
`;

const Result = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  border: solid 1px gray;
  box-sizing: border-box;

  padding: 10px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
`;

// interface BridgeMessage {
//   cmd: string;
//   type: string;
//   body: string;
// }

declare global {
  var _Bridge: {
    insertText: (contents: string) => void;
  };
}

export default function AITest() {
  const [result, setResult] = useState('ready');

  const insertText = (msg: string) => {
    try {
      window._Bridge.insertText(msg);
      setResult(`success message
      ${JSON.stringify(msg)}`);
    } catch (err) {
      setResult(JSON.stringify(err));
    }
  };

  const onTestString = () => {
    insertText('hello world');
  };

  return (
    <Wrapper>
      <Body>
        <Result>{result}</Result>
        <Row>
          <TestButton onClick={onTestString}>test string</TestButton>
          <TestButton onClick={onTestString}>test html</TestButton>
          <TestButton onClick={onTestString}>test image</TestButton>
        </Row>
      </Body>
    </Wrapper>
  );
}
