import ExTextbox from '../components/ExTextbox';
import { useCallback, useState } from 'react';
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

import iconRatioSqure from '../img/text2Img/square.svg';
import iconRatioSqure_purple from '../img/text2Img/square_purple.svg';
import iconRatioHorizontal from '../img/text2Img/horizontal.svg';
import iconRatioHorizontal_purple from '../img/text2Img/horizontal_purple.svg';
import iconRatioVertical from '../img/text2Img/vertical.svg';
import iconRatioVertical_purple from '../img/text2Img/vertical_purple.svg';

import iconCredit from '../img/ico_credit.svg';
import iconCreditText from '../img/text2Img/ico_creating_text.svg';
import { userSelectCss } from '../style/cssCommon';

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
    imgItem: iconStyleNone,
    selectedImgItem: iconStyleNonePurple
  },
  {
    id: 'selectStylePhoto',
    title: '사진',
    imgItem: iconStylePhoto,
    selectedImgItem: iconStylePhoto
  },
  {
    id: 'selectStyleConcept',
    title: '컨셉아트',
    imgItem: iconStyleConcept,
    selectedImgItem: iconStyleConcept
  },
  {
    id: 'selectStyle3d',
    title: '3D',
    imgItem: iconStyle3d,
    selectedImgItem: iconStyle3d
  },
  {
    id: 'selectStyleAni',
    title: '애니메이션',
    imgItem: iconStyleAni,
    selectedImgItem: iconStyleAni
  },
  {
    id: 'selectStyleRet',
    title: '레트로',
    imgItem: iconStyleRet,
    selectedImgItem: iconStyleRet
  },
  {
    id: 'selectStyleWater',
    title: '수채화',
    imgItem: iconStyleWater,
    selectedImgItem: iconStyleWater
  },
  {
    id: 'selectStyleOil',
    title: '유채화',
    imgItem: iconStyleOil,
    selectedImgItem: iconStyleOil
  }
];

const selectImageRatioItemList = [
  {
    id: 'selectRatioSqure',
    title: '정사각형',
    imgItem: iconRatioSqure,
    selectedImgItem: iconRatioSqure_purple
  },
  {
    id: 'selectRatioHorizontal',
    title: '가로',
    imgItem: iconRatioHorizontal,
    selectedImgItem: iconRatioHorizontal_purple
  },
  {
    id: 'selectRatioVertical',
    title: '세로',
    imgItem: iconRatioVertical,
    selectedImgItem: iconRatioVertical_purple
  }
];

const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const SelectOptionArea = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
`;

const SubTitleArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const RowContainer = styled.div`
  width: '100%';
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  gap: 8px;
`;

const ContainerItem = styled.div`
  display: flex;
  flex-direction: column;

  gap: 8px;
`;

const ItemTitle = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;

  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  font-weight: 400;
  color: var(--gray-gray-80-02);

  ${({ isSelected }) =>
    isSelected &&
    css`
      font-weight: 700;
      color: var(--ai-purple-50-main);
    `}
`;

const ItemIconBox = styled.div<{
  width: number;
  height: number;
  isSelected: boolean;
  cssExt?: any;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: var(--gray-gray-20);
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    background-color: var(--ai-purple-97-list-over);
  }

  ${({ width, height }) =>
    css`
      width: ${width}px;
      height: ${height}px;
    `}

  ${({ cssExt }) => cssExt && cssExt}

  ${({ isSelected }) =>
    isSelected &&
    css`
      border: solid 1px var(--ai-purple-80-sub);
      background-color: var(--ai-purple-97-list-over);
    `}
`;

const GenButton = styled.div<{ disabled: boolean }>`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 35px;
  cursor: pointer;
  gap: 6px;

  font-size: 13px;
  font-weight: 500;
  line-height: 1.54;
  color: #fff;
  border-radius: 4px;
  background-image: linear-gradient(to left, #a86cea, var(--ai-purple-50-main) 100%);

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}
`;

const GenButtonImg = styled.img`
  ${userSelectCss}
`;

const GenButtonText = styled.span`
  ${userSelectCss}
`;

const CreditImg = styled.img`
  position: absolute;
  right: 6px;
  ${userSelectCss}
`;

const ImagePreview = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
`;

const ImageDesc = styled.div`
  font-size: 13px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  color: var(--gray-gray-60-03);
`;

const ImageList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 8px;
`;

interface AiImageResponse {
  contentType: string;
  data: string;
}

const ImageCreate = () => {
  const [descInput, setDescInput] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('selectStyleNone');
  const [selectedRatio, setSelectedRatio] = useState<string>('selectRatioSqure');
  const [aiImgs, setAiImgs] = useState<AiImageResponse[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [creating, setCreating] = useState(false);

  const createAiImage = useCallback(async () => {
    try {
      setCreating(true);
      const res = await fetch(`/api/v1/image/genImageByDreamXL`, {
        headers: { 'content-type': 'text/plain' },
        body: descInput,
        method: 'POST'
      });
      const body = await res.json();
      const { images } = body.data;
      if (images) {
        setCreating(false);
        setAiImgs(images);
      }
    } catch (err) {}
  }, [descInput]);

  return (
    <Body>
      {aiImgs.length === 0 ? (
        creating === false ? (
          <>
            <ExTextbox
              exampleList={exampleList}
              maxtTextLen={1000}
              subTitle="이미지 설명 작성하기"
              value={descInput}
              setValue={setDescInput}
            />
            <SelectOptionArea>
              <SubTitleArea>
                <SubTitle subTitle="스타일 선택하기" />
              </SubTitleArea>
              <RowContainer>
                {selectStyleItemList.map((item) => {
                  return (
                    <ContainerItem key={item.id} onClick={() => setSelectedStyle(item.id)}>
                      <ItemIconBox width={80} height={80} isSelected={item.id === selectedStyle}>
                        <img
                          style={{
                            width: item.id === 'selectStyleNone' ? '24px' : '100%',
                            height: item.id === 'selectStyleNone' ? '24px' : '100%'
                          }}
                          src={item.id === selectedStyle ? item.selectedImgItem : item.imgItem}
                          alt=""></img>
                      </ItemIconBox>
                      <ItemTitle isSelected={item.id === selectedStyle}>{item.title}</ItemTitle>
                    </ContainerItem>
                  );
                })}
              </RowContainer>
            </SelectOptionArea>
            <SelectOptionArea>
              <SubTitleArea>
                <SubTitle subTitle="이미지 비율 선택하기" />
              </SubTitleArea>
              <RowContainer>
                {selectImageRatioItemList.map((item) => {
                  return (
                    <ContainerItem key={item.id} onClick={() => setSelectedRatio(item.id)}>
                      <ItemIconBox width={81} height={48} isSelected={item.id === selectedRatio}>
                        <img
                          src={item.id === selectedRatio ? item.selectedImgItem : item.imgItem}
                          alt=""></img>
                      </ItemIconBox>
                      <ItemTitle isSelected={item.id === selectedRatio}>{item.title}</ItemTitle>
                    </ContainerItem>
                  );
                })}
              </RowContainer>
            </SelectOptionArea>
            <GenButton disabled={!descInput} onClick={createAiImage}>
              <GenButtonImg src={iconCreditText} />
              <GenButtonText>이미지 생성하기</GenButtonText>
              <CreditImg src={iconCredit} />
            </GenButton>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {aiImgs &&
                aiImgs.map((img) => (
                  <img
                    style={{ width: '100px', height: '100px' }}
                    src={`data:${img.contentType};base64,${img.data}`}
                    alt=""></img>
                ))}
            </div>
          </>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            Creating...
          </div>
        )
      ) : (
        <>
          <SubTitleArea>
            <SubTitle subTitle="이미지 미리보기" />
            <button
              onClick={() => {
                setAiImgs([]);
                setPreviewIndex(0);
              }}>
              주제 다시 입력하기
            </button>
          </SubTitleArea>
          <ImageDesc>{descInput}</ImageDesc>
          <ImagePreview>
            <img
              style={{ width: '100%', height: '100%' }}
              src={`data:${aiImgs[previewIndex].contentType};base64,${aiImgs[previewIndex].data}`}
              alt=""></img>
          </ImagePreview>
          <ImageList>
            <button
              onClick={() =>
                setPreviewIndex((prev) => {
                  return (prev + aiImgs.length - 1) % aiImgs.length;
                })
              }>
              prev
            </button>
            {aiImgs.map((img, index) => (
              <img
                onClick={() => setPreviewIndex(index)}
                style={{ width: '60px', height: '60px' }}
                src={`data:${img.contentType};base64,${img.data}`}
                alt=""></img>
            ))}
            <button
              onClick={() =>
                setPreviewIndex((prev) => {
                  return (prev + aiImgs.length + 1) % aiImgs.length;
                })
              }>
              next
            </button>
          </ImageList>
          <RowContainer>
            <button onClick={createAiImage}>다시 만들기</button>
            <button>다운로드</button>
            <GenButton disabled={false}>문서에 삽입하기</GenButton>
          </RowContainer>
        </>
      )}
    </Body>
  );
};

export default ImageCreate;
