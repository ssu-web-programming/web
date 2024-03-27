import styled from 'styled-components';
import { markdownToHtml } from '../util/common';

const Pre = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  font-weight: normal;
  font-size: 13px;
  margin: 0px;
  padding: 0px;

  p {
    margin: 0px;
    padding: 0px;
    word-break: break-all;
  }
`;

const PreMarkdown = ({ text }: { text: string }) => {
  return (
    <Pre
      ref={async (el) => {
        if (el) {
          const html = await markdownToHtml(text);
          if (html) {
            el.innerHTML = html;
          }
        }
      }}></Pre>
  );
};

export default PreMarkdown;
