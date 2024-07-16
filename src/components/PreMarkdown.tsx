import React, { useState } from 'react';
import styled from 'styled-components';
import { markdownToHtml } from '../util/common';

const Pre = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: normal;
  font-size: 13px;
  margin: 0px;
  padding: 0px;

  p {
    margin: 0px;
    padding: 0px;
    word-break: break-all;
  }

  img {
    width: 160px;
    height: 160px;
    border-radius: 4px;
    border: 1px solid #c9cdd2;
    display: block;
    cursor: pointer;
  }
`;

const PreMarkdown = ({ text, children }: { text: string; children?: React.ReactNode }) => {
  const [image, setImage] = useState<string | null>(null);

  const onClose = () => {
    setImage(null);
  };

  return (
    <>
      <Pre
        ref={async (el) => {
          if (el) {
            const html = await markdownToHtml(text);
            if (html) {
              el.innerHTML = html;
              el.querySelectorAll('img').forEach((img) =>
                img.addEventListener('click', () => setImage(img.src))
              );
            }
          }
        }}></Pre>

      {/* overlay */}
      {image && children && React.cloneElement(children as React.ReactElement, { image, onClose })}
    </>
  );
};

export default PreMarkdown;
