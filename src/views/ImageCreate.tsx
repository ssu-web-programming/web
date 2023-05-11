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

import iconPrev from '../img/ico_arrow_prev.svg';
import iconNext from '../img/ico_arrow_next.svg';

import { purpleBtnCss } from '../style/cssCommon';
import Loading from '../components/Loading';
import Button from '../components/Button';
import RecreatingButton from '../components/RecreatingButton';
import Icon from '../components/Icon';
import { RightBox, RowBox } from './AIChatTab';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  addT2I,
  selectT2IHIstory,
  updateT2ICurItemIndex,
  updateT2ICurListId
} from '../store/slices/txt2imgHistory';
import { JSON_CONTENT_TYPE, SESSION_KEY_LIST, TEXT_TO_IMAGE_API } from '../api/constant';
import { activeToast } from '../store/slices/toastSlice';

const exampleList = [
  '노을진 바다 위 비행기',
  '19세기 뉴욕 거리를 달리는 호랑이',
  '레오나르도 다빈치가 그린 해변에 있는 팬더',
  '로봇들만 있는 도시가 된 뉴욕,사이버펑크,현실적,4K,HQ',
  '모나리자 초상화 컨셉의 강아지',
  '하우스, 컨셉아트, 매트페인팅, HQ, 4k',
  '한강에서 새해 축하 행사의 모습, 불꽃놀이, 드론 쇼, 초현실적, 8k 높은 디테일',
  '만화 컨셉의 해리포터 포스터, 4K, HQ'
];

const selectStyleItemList = [
  {
    id: 'none',
    title: '없음',
    imgItem: iconStyleNone,
    selectedImgItem: iconStyleNonePurple
  },
  {
    id: 'photographic',
    title: '사진',
    imgItem: iconStylePhoto,
    selectedImgItem: iconStylePhoto
  },
  {
    id: 'fantasy-art',
    title: '컨셉아트',
    imgItem: iconStyleConcept,
    selectedImgItem: iconStyleConcept
  },
  {
    id: '3d-model',
    title: '3D',
    imgItem: iconStyle3d,
    selectedImgItem: iconStyle3d
  },
  {
    id: 'anime',
    title: '애니메이션',
    imgItem: iconStyleAni,
    selectedImgItem: iconStyleAni
  },
  {
    id: 'retro',
    title: '레트로',
    imgItem: iconStyleRet,
    selectedImgItem: iconStyleRet
  },
  {
    id: 'watercolor',
    title: '수채화',
    imgItem: iconStyleWater,
    selectedImgItem: iconStyleWater
  },
  {
    id: 'oil-painting',
    title: '유채화',
    imgItem: iconStyleOil,
    selectedImgItem: iconStyleOil
  }
];

const selectImageRatioItemList = [
  {
    id: '512x512',
    title: '정사각형',
    imgItem: iconRatioSqure,
    selectedImgItem: iconRatioSqure_purple
  },
  {
    id: '512x320',
    title: '가로',
    imgItem: iconRatioHorizontal,
    selectedImgItem: iconRatioHorizontal_purple
  },
  {
    id: '320x512',
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
  padding: 16px;
  box-sizing: border-box;

  overflow-y: auto;
  overflow-x: hidden;
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
  cursor: pointer;

  &:hover {
    div {
      padding: 2px;
    }
  }

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
  cursor: pointer;

  &:hover {
    background-color: var(--ai-purple-97-list-over);
    padding: 2px;
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
      border: solid 2px var(--ai-purple-80-sub);
      background-color: var(--ai-purple-97-list-over);
      padding: 2px;
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

const ImagePreview = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 348px;
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

export interface AiImageResponse {
  contentType: string;
  data: string;
}

const ImageCreate = ({ contents }: { contents?: string }) => {
  const [descInput, setDescInput] = useState<string>(contents ? contents : '');
  const [selectedStyle, setSelectedStyle] = useState<string>('none');
  const [selectedRatio, setSelectedRatio] = useState<string>('512x512');
  const [creating, setCreating] = useState(false);
  const dispatch = useAppDispatch();
  const { currentListId, currentItemIdx, history } = useAppSelector(selectT2IHIstory);

  const createAiImage = useCallback(async () => {
    try {
      const assistantId = uuidv4();

      setCreating(true);
      dispatch(
        activeToast({
          active: true,
          msg: '이미지를 생성합니다. 10 크레딧이 차감되었습니다. (잔여 크레딧 :980)',
          isError: false
        })
      );

      const apiBody: any = {
        prompt: descInput,
        imgSize: selectedRatio
      };
      if (selectedStyle !== 'none') apiBody['style_preset'] = selectedStyle;

      const res = await fetch(TEXT_TO_IMAGE_API, {
        headers: { ...JSON_CONTENT_TYPE, ...SESSION_KEY_LIST },
        body: JSON.stringify(apiBody),
        method: 'POST'
      });
      const body = await res.json();
      const { images } = body.data;
      if (images) {
        dispatch(
          addT2I({
            id: assistantId,
            list: images,
            input: descInput,
            style: selectedStyle,
            ratio: selectedRatio
          })
        );
        dispatch(updateT2ICurListId(assistantId));
        dispatch(updateT2ICurItemIndex(0));

        setCreating(false);
        dispatch(
          activeToast({
            active: true,
            msg: `이미지 생성 완료. 원하는 작업을 실행하세요.`,
            isError: false
          })
        );

        // setAiImgs(images);
      }
    } catch (err) {
      dispatch(
        activeToast({
          active: true,
          msg: '폴라리스 오피스 AI의 생성이 잘 되지 않았습니다. 다시 시도해보세요.',
          isError: true
        })
      );
    }
  }, [descInput, selectedRatio, selectedStyle]);

  const currentHistory =
    history && history.length > 0 && history?.filter((history) => history.id === currentListId)[0];

  const curListIndex = history.findIndex((list) => list.id === currentListId);

  return (
    <Body>
      {creating ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Loading>
            폴라리스오피스 AI가 작성하신 내용을 이미지로 만들고 있어요.
            <br />
            잠시만 기다려주세요.
          </Loading>
        </div>
      ) : !currentHistory ? (
        <>
          <div>
            <ExTextbox
              exampleList={exampleList}
              maxtTextLen={1000}
              subTitle="이미지 설명 작성하기"
              value={descInput}
              setValue={setDescInput}
            />
          </div>
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
                          width: item.id === 'none' ? '24px' : '100%',
                          height: item.id === 'none' ? '24px' : '100%'
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
          <Button
            isCredit={true}
            onClick={createAiImage}
            cssExt={css`
              width: 100%;
              box-sizing: border-box;
              flex: none;
              ${purpleBtnCss}
            `}>
            이미지 생성하기
          </Button>
        </>
      ) : (
        <>
          <SubTitleArea>
            <SubTitle subTitle="이미지 미리보기" />
            <RecreatingButton
              onClick={() => {
                dispatch(updateT2ICurListId(null));
                dispatch(updateT2ICurItemIndex(null));
              }}
            />
          </SubTitleArea>
          <RowBox
            cssExt={css`
              justify-content: center;
              font-size: 13px;
              color: var(--gray-gray-70);
            `}>
            <Icon
              cssExt={css`
                width: 16px;
                height: 16px;
                padding: 6px 3px 6px 5px;
                margin-right: 12px;
              `}
              iconSrc={iconPrev}
              onClick={() => {
                if (history.length <= 1) return;

                if (curListIndex > 0) dispatch(updateT2ICurListId(history[curListIndex - 1].id));
              }}
            />
            <div>
              {curListIndex + 1}/{history.length}
            </div>
            <Icon
              cssExt={css`
                width: 16px;
                height: 16px;
                padding: 6px 3px 6px 5px;
                margin-left: 12px;
              `}
              iconSrc={iconNext}
              onClick={() => {
                if (history.length <= 1) return;

                if (curListIndex < history.length - 1)
                  dispatch(updateT2ICurListId(history[curListIndex + 1].id));
              }}
            />
          </RowBox>
          <ImageDesc>{currentHistory.input}</ImageDesc>
          <ImagePreview>
            {currentItemIdx !== null && (
              <img
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                src={`data:${currentHistory.list[currentItemIdx].contentType};base64,${currentHistory.list[currentItemIdx].data}`}
                alt=""></img>
            )}
          </ImagePreview>
          <ImageList>
            <Icon
              iconSrc={iconPrev}
              onClick={() => {
                if (currentItemIdx && currentItemIdx >= 1) {
                  dispatch(updateT2ICurItemIndex(currentItemIdx - 1));
                }
              }}
            />
            {currentHistory.list.map((img, index) => (
              <img
                onClick={() => {
                  dispatch(updateT2ICurItemIndex(index));
                }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: `${index === currentItemIdx ? '1' : '0.6'}`
                }}
                src={`data:${img.contentType};base64,${img.data}`}
                alt=""></img>
            ))}
            <Icon
              iconSrc={iconNext}
              onClick={() => {
                if (currentItemIdx !== null && currentItemIdx <= 2) {
                  dispatch(updateT2ICurItemIndex(currentItemIdx + 1));
                }
              }}
            />
          </ImageList>
          <RowContainer>
            <Button isCredit={true} onClick={createAiImage}>
              다시 만들기
            </Button>
            <Button
              onClick={() => {
                // TODO: 다운로드 로직 부착
              }}>
              다운로드
            </Button>
            <GenButton
              onClick={() => {
                // TODO: 문서 삽입 로직

                dispatch(
                  activeToast({
                    active: true,
                    msg: `이미지가 문서에 삽입이 완료 되었습니다.`,
                    isError: false
                  })
                );
              }}
              disabled={false}>
              문서에 삽입하기
            </GenButton>
          </RowContainer>
          <RightBox>
            <div style={{ color: '#8769ba', fontSize: '11px' }}>
              Powered By <b>Stable Diffusion</b>
            </div>
          </RightBox>
        </>
      )}
    </Body>
  );
};

export default ImageCreate;
