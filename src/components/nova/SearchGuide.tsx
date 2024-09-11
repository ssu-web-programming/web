import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import ico_documents from '../../img/ico_documents.svg';
import ico_image from '../../img/ico_image.svg';
import AIChatIcon from '../../img/nova/aiChat/ai_chat.png';
import Icon from '../Icon';

const flexCenter = css`
  display: flex;
  align-items: center;
`;

const GuideImage = styled.img`
  width: 120px;
  height: 80px;
`;

const GuideTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0 16px;

  div.title {
    ${flexCenter};
    justify-content: center;

    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: #6f3ad0;
  }

  p.subTitle {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: #454c53;
    text-align: center;
    white-space: break-spaces;
  }
`;
const Guidebody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const GuideExample = styled.div`
  ${flexCenter};
  justify-content: flex-start;
  gap: 8px;
  padding: 12px;
  margin: 0 16px;
  border: 1px solid #c9cdd2;
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
        <GuideImage src={AIChatIcon} alt="aiChat" />
        <div className="title">
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
