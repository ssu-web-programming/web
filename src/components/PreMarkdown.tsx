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
  }
`;

const PreMarkdown = ({ text }: { text: string }) => {
  return (
    <Pre
      style={{
        whiteSpace: 'pre-wrap',
        // fontFamily: 'Noto Sans KR',
        fontWeight: 'normal',
        fontSize: '13px',
        margin: '0px',
        padding: '0px'
      }}
      ref={(el) => {
        if (el) el.scrollTo(0, el.scrollHeight);
      }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </Pre>
  );
};

export default PreMarkdown;
