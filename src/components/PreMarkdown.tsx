import remarkGfm from 'remark-gfm';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import styled from 'styled-components';

const Pre = styled.div`
  overflow-x: auto;
  width: 100%;
  height: 100%;
  p {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
  }
`;

const PreMarkdown = ({
  text,
  endRef
}: {
  text: string;
  endRef?: React.RefObject<HTMLDivElement> | null;
}) => {
  return (
    <Pre
      style={{
        whiteSpace: 'pre-wrap',
        // fontFamily: 'Noto Sans KR',
        fontWeight: 'normal',
        fontSize: '13px',
        margin: '0px',
        padding: '0px'
      }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      {endRef && <div ref={endRef} />}
    </Pre>
  );
};

export default PreMarkdown;
