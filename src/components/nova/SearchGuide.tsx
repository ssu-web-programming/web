import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import ico_ai from '../../img/ico_ai.svg';
import ico_documents from '../../img/ico_documents.svg';
import ico_image from '../../img/ico_image.svg';
import Icon from '../Icon';

const flexCenter = css`
  display: flex;
  align-items: center;
`;

const GuideTitle = styled.div`
  padding: 0 17px;

  div.title {
    ${flexCenter}
    justify-content: center;
    margin-bottom: 8px;

    font-size: 18px;
    font-weight: 500;
    line-height: 27px;
    color: var(--ai-purple-50-main);
  }

  p.subTitle {
    font-size: 14px;
    line-height: 21px;
    letter-spacing: -0.02em;
    color: var(--gray-gray-80-02);
    text-align: center;
  }
`;
const Guidebody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;
`;

const GuideExample = styled.div`
  ${flexCenter}
  justify-content: flex-start;
  gap: 8px;
  padding: 12px;
  margin: 0 16px;
  border: 1px solid var(--gray-gray-40);
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: var(--gray-gray-80-02);

  &:hover {
    cursor: pointer;
  }
`;

interface SearchGuideProps {
  setInputContents: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchGuide = (props: SearchGuideProps) => {
  const { t } = useTranslation();

  const PROMPT_EXAMPLE = [
    {
      src: ico_documents,
      txt: t(`Nova.SearchGuide.Example1`)
    },
    {
      src: ico_image,
      txt: t(`Nova.SearchGuide.Example2`)
    },
    {
      src: ico_documents,
      txt: t(`Nova.SearchGuide.Example3`)
    }
  ];

  return (
    <>
      <GuideTitle>
        <div className="title">
          <Icon iconSrc={ico_ai} size="lg" />
          <p>{t(`Nova.SearchGuide.Title`)}</p>
        </div>
        <p className="subTitle">{t(`Nova.SearchGuide.SubTitle`)}</p>
      </GuideTitle>

      <Guidebody>
        {PROMPT_EXAMPLE.map((item) => (
          <GuideExample key={item.txt} onClick={() => props.setInputContents(item.txt)}>
            <Icon iconSrc={item.src} size="md" />
            <span>{item.txt}</span>
          </GuideExample>
        ))}
      </Guidebody>
    </>
  );
};
