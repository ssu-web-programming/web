import ExTextbox from '../components/ExTextbox';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import SubTitle from '../components/SubTitle';

import iconStyleNone from '../img/text2Img/non_select.svg';
import iconStyleNonePurple from '../img/text2Img/non_select_purple.svg';
import iconStylePhoto from '../img/text2Img/photo@2x.png';
import iconStyleConcept from '../img/text2Img/concept@2x.png';
import iconStyle3d from '../img/text2Img/3d@2x.png';
import iconStyleAni from '../img/text2Img/ani@2x.png';
import iconStyleRet from '../img/text2Img/ret@2x.png';
import iconStyleWater from '../img/text2Img/water@2x.png';
import iconStyleOil from '../img/text2Img/oil@2x.png';

const exampleList = [
  '노을진 바다 위 비행기',
  '19세기 뉴욕 거리를 달리는 호랑이',
  '레오나르도 다빈치가 그린 해변에 있는 팬더',
  '로봇들만 있는 도시가 된 뉴욕,사이버펑크,현실적,4K,HQ',
  '모나리자 초상화 컨셉의 강아지',
  '하우스, 컨셉아트, 매트페인팅, HQ, 4k',
  '한강에서 새해 충사 행사의 모습, 불꽃놀이, 드론 쇼, 초현실적, 8k 높은 디테일',
  '만화 컨셉의 해리포터 포스터, 4K, HQ'
];

const selectStyleItemList = [
  {
    id: 'selectStyleNone',
    title: '없음',
    imgItem: iconStyleNone
  },
  {
    id: 'selectStylePhoto',
    title: '사진',
    imgItem: iconStylePhoto
  },
  {
    id: 'selectStyleConcept',
    title: '컨셉아트',
    imgItem: iconStyleConcept
  },
  {
    id: 'selectStyle3d',
    title: '3D',
    imgItem: iconStyle3d
  },
  {
    id: 'selectStyleAni',
    title: '애니메이션',
    imgItem: iconStyleAni
  },
  {
    id: 'selectStyleRet',
    title: '레트로',
    imgItem: iconStyleRet
  },
  {
    id: 'selectStyleWater',
    title: '수채화',
    imgItem: iconStyleWater
  },
  {
    id: 'selectStyleOil',
    title: '유채화',
    imgItem: iconStyleOil
  }
];

const SelectStyleArea = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
`;

const SubTitleArea = styled.div`
  width: 100%;
  height: 20px;
`;

const StyleSelectGrid = styled.div`
  display: grid;
  /* width: 100%; */
  height: 230px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-row-gap: 10px;
  grid-column-gap: 8px;
  margin: 0 10px;
  box-sizing: border-box;
`;

const StyleSelectGridItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
`;
const StyleSelectGridItemTitle = styled.div<{ isSelected: boolean }>`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: var(--gray-gray-80-02);

  ${({ isSelected }) =>
    isSelected &&
    css`
      font-weight: 700;
      color: var(--ai-purple-50-main);
    `}
`;
const StyleSelectGridItemImageArea = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 81px;
  height: 80px; */
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-sizing: border-box;

  ${({ isSelected }) => {
    if (isSelected)
      return css`
        outline: 0.2rem solid var(--ai-purple-80-sub);
        outline-offset: 3px;
      `;
    return css`
      &:hover {
        outline: 0.2rem solid var(--ai-purple-99-bg-light);
        outline-offset: 3px;
      }
    `;
  }}
`;

const StyleSelectGridItemImage = styled.img`
  width: 100%;
  border-radius: 4px;

  /* background-color: var(--gray-gray-20); */
`;

const StyleNoneGridItemImageArea = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 81px;
  height: 80px; */
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-sizing: border-box;

  background-color: var(--gray-gray-20);

  &:hover {
    background-color: var(--ai-purple-97-list-over);
  }

  ${({ isSelected }) =>
    isSelected &&
    css`
      outline: 0.2rem solid var(--ai-purple-80-sub);
      background-color: var(--ai-purple-97-list-over);
    `}
`;

const StyleNoneGridItemImage = styled.img<{ isSelected: boolean }>`
  width: 30%;
  height: 30%;
  border-radius: 4px;
`;

const ImageCreate = () => {
  const [descInput, setDescInput] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState('selectStyleNone');

  return (
    <>
      <ExTextbox
        exampleList={exampleList}
        maxtTextLen={1000}
        subTitle="이미지 설명 작성하기"
        value={descInput}
        setValue={setDescInput}
      />
      <SelectStyleArea>
        <SubTitleArea>
          <SubTitle subTitle="스타일 선택하기" />
        </SubTitleArea>
        <StyleSelectGrid>
          {selectStyleItemList.map((item) => {
            return (
              <StyleSelectGridItem key={item.id} onClick={() => setSelectedStyle(item.id)}>
                {item.id === 'selectStyleNone' ? (
                  <StyleNoneGridItemImageArea isSelected={item.id === selectedStyle}>
                    <StyleNoneGridItemImage
                      src={item.id === selectedStyle ? iconStyleNonePurple : item.imgItem}
                      isSelected={item.id === selectedStyle}
                    />
                  </StyleNoneGridItemImageArea>
                ) : (
                  <StyleSelectGridItemImageArea isSelected={item.id === selectedStyle}>
                    <StyleSelectGridItemImage src={item.imgItem} />
                  </StyleSelectGridItemImageArea>
                )}

                <StyleSelectGridItemTitle isSelected={item.id === selectedStyle}>
                  {item.title}
                </StyleSelectGridItemTitle>
              </StyleSelectGridItem>
            );
          })}
        </StyleSelectGrid>
      </SelectStyleArea>
    </>
  );
};

export default ImageCreate;
