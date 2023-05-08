import remarkGfm from 'remark-gfm';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const PreMarkdown = ({
  text,
  endRef
}: {
  text: string;
  endRef?: React.RefObject<HTMLDivElement> | null;
}) => {
  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'NotoSansCJKKR', fontSize: '13px' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      {endRef && <div ref={endRef} />}
    </pre>
  );
};

export default PreMarkdown;
