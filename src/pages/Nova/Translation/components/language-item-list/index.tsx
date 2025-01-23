import styled from 'styled-components';

interface LanguageItemProps {
  value: string;
}

interface Props {
  title: string;
  langList: string[];
}

function LanguageItem({ value }: LanguageItemProps) {
  return <S.LanguageItem>{value}</S.LanguageItem>;
}

export default function LanguageItemList({ langList, title }: Props) {
  return (
    <>
      <S.LanguageTitle>{title}</S.LanguageTitle>
      {langList.map((lang, idx) => (
        <LanguageItem key={idx} value={lang} />
      ))}
    </>
  );
}

const S = {
  LanguageTitle: styled.p`
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    text-align: left;
    margin-top: 16px;
    color: #9ea4aa;
  `,
  LanguageItem: styled.p`
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  `
};
