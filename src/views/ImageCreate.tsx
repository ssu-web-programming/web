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
import iconCreatingWhite from '../img/ico_creating_text_white.svg';

import {
  flexColumn,
  purpleBtnCss,
  justiSpaceBetween,
  flexWrap,
  justiCenter,
  alignItemCenter,
  justiSpaceAround,
  flex,
  flexShrink
} from '../style/cssCommon';
import Loading from '../components/Loading';
import Button from '../components/Button';
import RecreatingButton from '../components/RecreatingButton';
import Icon from '../components/Icon';
import { RightBox, RowBox } from './AIChatTab';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  T2IType,
  addT2I,
  selectT2IHIstory,
  updateT2ICurItemIndex,
  updateT2ICurListId
} from '../store/slices/txt2imgHistory';
import { JSON_CONTENT_TYPE, TEXT_TO_IMAGE_API } from '../api/constant';
import { activeToast } from '../store/slices/toastSlice';
import useApiWrapper from '../api/useApiWrapper';
import { useTranslation } from 'react-i18next';
import { calLeftCredit } from '../util/common';
import useErrorHandle from '../components/hooks/useErrorHandle';
import { INVALID_PROMPT } from '../error/error';
import { setCreating } from '../store/slices/tabSlice';
import LinkText from '../components/LinkText';

const exampleList = [
  'Flight',
  'Tiger',
  'Panda',
  'City',
  'Puppy',
  'Space',
  'House',
  'NewYear',
  'ComicPoster'
];

const selectStyleItemList = [
  {
    id: 'none',
    title: 'None',
    imgItem: iconStyleNone,
    selectedImgItem: iconStyleNonePurple
  },
  {
    id: 'photographic',
    title: 'Picture',
    imgItem: iconStylePhoto,
    selectedImgItem: iconStylePhoto
  },
  {
    id: 'fantasy-art',
    title: 'ConceptArt',
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
    title: 'Anime',
    imgItem: iconStyleAni,
    selectedImgItem: iconStyleAni
  },
  {
    id: 'x-po-retro',
    title: 'Retro',
    imgItem: iconStyleRet,
    selectedImgItem: iconStyleRet
  },
  {
    id: 'x-po-watercolor-painting',
    title: 'WaterPainting',
    imgItem: iconStyleWater,
    selectedImgItem: iconStyleWater
  },
  {
    id: 'x-po-oil-painting',
    title: 'OilPainting',
    imgItem: iconStyleOil,
    selectedImgItem: iconStyleOil
  }
];

const selectImageRatioItemList = [
  {
    id: '512x512',
    title: 'Squre',
    imgItem: iconRatioSqure,
    selectedImgItem: iconRatioSqure_purple
  },
  {
    id: '512x320',
    title: 'Horizontal',
    imgItem: iconRatioHorizontal,
    selectedImgItem: iconRatioHorizontal_purple
  },
  {
    id: '320x512',
    title: 'Vertical',
    imgItem: iconRatioVertical,
    selectedImgItem: iconRatioVertical_purple
  }
];

const Body = styled.div`
  width: 100%;
  height: 100%;
  ${flexColumn}
  /* gap: 17px; */
  padding: 16px;
  box-sizing: border-box;

  overflow-y: auto;
  overflow-x: hidden;
`;

const SelectOptionArea = styled.div`
  width: 100%;
  ${flexColumn}

  gap: 8px;
`;

const SubTitleArea = styled.div`
  width: 100%;
  ${justiSpaceBetween}
  ${alignItemCenter}
`;

const RowContainer = styled.div<{
  cssExt?: any;
}>`
  width: '100%';
  ${flexWrap}

  gap: 8px;

  ${({ cssExt }) => cssExt && cssExt}
`;

const ContainerItem = styled.div`
  ${flexColumn}
  ${alignItemCenter}

  gap: 8px;
`;

const ItemTitle = styled.div<{ isSelected: boolean }>`
  ${justiCenter}
  ${alignItemCenter}

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
  width?: number;
  height?: number;
  isSelected: boolean;
  cssExt?: any;
}>`
  width: 100%;
  height: 100%;
  ${justiCenter}
  ${alignItemCenter}
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

  ${({ isSelected }) =>
    isSelected &&
    css`
      border: solid 2px var(--ai-purple-80-sub);
      background-color: var(--ai-purple-97-list-over);
      padding: 2px;
    `}

  ${({ cssExt }) => cssExt && cssExt}
`;

const GenButton = styled.div<{ disabled: boolean }>`
  position: relative;
  ${justiCenter}
  ${alignItemCenter}
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
  margin-top: 16px;
`;

const ImageDesc = styled.div`
  font-size: 13px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  color: var(--gray-gray-60-03);

  min-height: 40px;
  max-height: 40px;
  box-sizing: content-box;
  margin: 8px 0px 4px 0px;

  width: 100%;
  ${flex}
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ImageList = styled.div`
  width: 100%;
  ${justiSpaceAround}
  ${alignItemCenter}
  height: 84px;
  box-sizing: border-box;
  /* margin-top: 12px; */
  padding: 12px 0px;
  margin: 12px 0px 12px 0px;
  gap: 0px 8px;
`;

const MakingInputWrapper = styled.div`
  ${flexColumn}
  gap: 16px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  max-width: fit-content;

  gap: 16px 8px;
`;

const Container4 = styled(GridContainer)`
  gap: 8px;
`;

const Container3 = styled.div`
  grid-column: 1 / 4;
  grid-row: 1 / 2;
  width: 100%;

  ${flex}
  gap: 8px;
`;

export interface AiImageResponse {
  contentType: string;
  data: string;
}

const ImageCreate = ({ contents }: { contents?: string }) => {
  const apiWrapper = useApiWrapper();
  const [descInput, setDescInput] = useState<string>(contents ? contents : '');
  const [selectedStyle, setSelectedStyle] = useState<string>('none');
  const [selectedRatio, setSelectedRatio] = useState<string>('512x512');
  const [creating, setCreatingImage] = useState(false);
  const dispatch = useAppDispatch();
  const { currentListId, currentItemIdx, history } = useAppSelector(selectT2IHIstory);
  const errorHandle = useErrorHandle();

  const { t } = useTranslation();

  const createAiImage = useCallback(
    async (remake?: T2IType) => {
      try {
        const assistantId = uuidv4();

        setCreatingImage(true);
        dispatch(setCreating('CreateImage'));

        const apiBody: any = {
          prompt: remake ? remake?.input : descInput,
          imgSize: remake ? remake?.ratio : selectedRatio
        };
        if (selectedStyle !== 'none')
          apiBody['style_preset'] = remake ? remake.style : selectedStyle;

        const res = await apiWrapper(TEXT_TO_IMAGE_API, {
          headers: {
            ...JSON_CONTENT_TYPE,
            'User-Agent': navigator.userAgent
          },
          body: JSON.stringify(apiBody),
          method: 'POST'
        });

        const body = await res.json();

        if (res.status !== 200) {
          if (body?.error?.code === 'invalid_prompt') throw new Error(INVALID_PROMPT);
          else throw res;
        }

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        dispatch(
          activeToast({
            active: true,
            msg: ` ${t(`Txt2ImgTab.ToastMsg.StartCreatingImage`)} 
             ${t(`ToastMsg.AboutCredit`, {
               deductionCredit: deductionCredit,
               leftCredit: leftCredit
             })}`,
            isError: false
          })
        );

        const { images } = body.data;
        if (images) {
          dispatch(
            addT2I({
              id: assistantId,
              list: images,
              input: remake ? remake?.input : descInput,
              style: remake ? remake?.style : selectedStyle,
              ratio: remake ? remake?.ratio : selectedRatio
            })
          );
          dispatch(updateT2ICurListId(assistantId));
          dispatch(updateT2ICurItemIndex(0));

          setCreatingImage(false);
          dispatch(setCreating('none'));
        }
      } catch (error: any) {
        dispatch(updateT2ICurListId(null));
        dispatch(updateT2ICurItemIndex(null));
        setCreatingImage(false);
        dispatch(setCreating('none'));
        errorHandle(error);
      }
    },
    [descInput, selectedRatio, selectedStyle]
  );

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
          <Loading>{t(`Txt2ImgTab.LoadingMsg`)}</Loading>
        </div>
      ) : !currentHistory ? (
        <MakingInputWrapper>
          <SelectOptionArea>
            <SubTitleArea>
              <SubTitle subTitle={t(`Txt2ImgTab.WritingImageDesc`)} />
            </SubTitleArea>
            <ExTextbox
              placeholder={t(`Txt2ImgTab.WriteImageDesc`) || ''}
              exampleList={exampleList}
              maxtTextLen={1000}
              value={descInput}
              setValue={setDescInput}
            />
          </SelectOptionArea>
          <SelectOptionArea>
            <SubTitleArea>
              <SubTitle subTitle={t('Txt2ImgTab.ChooseStyle')} />
            </SubTitleArea>
            <GridContainer>
              {selectStyleItemList.map((item) => {
                return (
                  <ContainerItem key={item.id} onClick={() => setSelectedStyle(item.id)}>
                    <ItemIconBox
                      cssExt={css`
                        border: ${item.id === 'none' &&
                        item.id === selectedStyle &&
                        'solid 1px var(--ai-purple-80-sub)'};

                        max-width: 81px;
                        height: 80px;
                      `}
                      isSelected={item.id === selectedStyle}>
                      <img
                        style={{
                          width: item.id === 'none' ? '24px' : '100%',
                          height: item.id === 'none' ? '24px' : '100%'
                        }}
                        src={item.id === selectedStyle ? item.selectedImgItem : item.imgItem}
                        alt=""></img>
                    </ItemIconBox>
                    <ItemTitle isSelected={item.id === selectedStyle}>
                      {t(`Txt2ImgTab.StyleList.${item.title}`)}
                    </ItemTitle>
                  </ContainerItem>
                );
              })}
            </GridContainer>
          </SelectOptionArea>
          <SelectOptionArea>
            <SubTitleArea>
              <SubTitle subTitle={t('Txt2ImgTab.ChooseRatio')} />
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
                    <ItemTitle isSelected={item.id === selectedRatio}>
                      {t(`Txt2ImgTab.RatioList.${item.title}`)}
                    </ItemTitle>
                  </ContainerItem>
                );
              })}
            </RowContainer>
          </SelectOptionArea>
          <Button
            isCredit={true}
            icon={iconCreatingWhite}
            onClick={() => {
              createAiImage();
            }}
            disable={descInput.length === 0}
            cssExt={css`
              width: 100%;
              box-sizing: border-box;
              flex: none;
              ${purpleBtnCss}
            `}>
            {t(`Txt2ImgTab.CreateImage`)}
          </Button>
        </MakingInputWrapper>
      ) : (
        <>
          <SubTitleArea>
            <SubTitle subTitle={t(`Txt2ImgTab.PreviewImage`)} />
            <RecreatingButton
              onClick={() => {
                dispatch(updateT2ICurListId(null));
                dispatch(updateT2ICurItemIndex(null));
              }}
            />
          </SubTitleArea>
          <ImageDesc>{currentHistory.input}</ImageDesc>
          <RowBox
            cssExt={css`
              ${justiCenter}
              font-size: 13px;
              color: var(--gray-gray-70);
            `}>
            <Icon
              cssExt={css`
                width: 16px;
                height: 16px;
                padding: 6px 3px 6px 5px;
                margin-right: 12px;
                opacity: ${curListIndex === 0 && '0.3'};
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
                opacity: ${curListIndex === history.length - 1 && '0.3'};
              `}
              iconSrc={iconNext}
              onClick={() => {
                if (history.length <= 1) return;

                if (curListIndex < history.length - 1)
                  dispatch(updateT2ICurListId(history[curListIndex + 1].id));
              }}
            />
          </RowBox>
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
              cssExt={css`
                opacity: ${currentItemIdx === 0 && '0.3'};
              `}
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
              cssExt={css`
                opacity: ${currentItemIdx === 3 && '0.3'};
              `}
              onClick={() => {
                if (currentItemIdx !== null && currentItemIdx <= 2) {
                  dispatch(updateT2ICurItemIndex(currentItemIdx + 1));
                }
              }}
            />
          </ImageList>
          <RowContainer>
            <Button
              isCredit={true}
              onClick={() => {
                createAiImage(currentHistory);
              }}>
              {t(`WriteTab.Recreating`)}
            </Button>
            <Button
              onClick={async () => {
                try {
                  if (currentItemIdx === null) throw new Error('invalid currentItemIdx');
                  const selected = currentHistory.list[currentItemIdx];

                  if (!selected) throw new Error('invalid target');

                  const res = await fetch(
                    `data:${currentHistory.list[currentItemIdx].contentType};base64,${currentHistory.list[currentItemIdx].data}`
                  );
                  const blob = await res.blob();
                  window._Bridge.downloadImage(blob);
                } catch (err) {
                  // TODO : error handle
                }
              }}>
              {t(`Download`)}
            </Button>
            <GenButton
              onClick={async () => {
                try {
                  if (currentItemIdx === null) throw new Error('invalid currentItemIdx');
                  const selected = currentHistory.list[currentItemIdx];

                  if (!selected) throw new Error('invalid target');

                  const res = await fetch(
                    `data:${currentHistory.list[currentItemIdx].contentType};base64,${currentHistory.list[currentItemIdx].data}`
                  );
                  const blob = await res.blob();
                  window._Bridge.insertImage(blob);

                  dispatch(
                    activeToast({
                      active: true,
                      msg: t(`Txt2ImgTab.ToastMsg.CompleteInsertImage`),
                      isError: false
                    })
                  );
                } catch (err) {
                  // TODO : error handle
                }
              }}
              disabled={false}>
              {t(`WriteTab.InsertDoc`)}
            </GenButton>
          </RowContainer>
          <RightBox
            cssExt={css`
              margin-top: 11px;
            `}>
            <LinkText url={t(`MoveToLimitInfo`)}>
              <div style={{ color: '#8769ba', fontSize: '11px' }}>
                Powered By <b>Stable Diffusion</b>
              </div>
            </LinkText>
          </RightBox>
        </>
      )}
    </Body>
  );
};

export default ImageCreate;
