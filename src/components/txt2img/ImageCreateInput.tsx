import styled, { css } from 'styled-components';
import iconStyleNone from '../../img/text2Img/non_select.svg';
import iconStyleNonePurple from '../../img/text2Img/non_select_purple.svg';
import iconStylePhoto from '../../img/text2Img/photo@2x.png';
import iconStyleConcept from '../../img/text2Img/concept@2x.png';
import iconStyle3d from '../../img/text2Img/3d@2x.png';
import iconStyleAni from '../../img/text2Img/ani@2x.png';
import iconStyleRet from '../../img/text2Img/ret@2x.png';
import iconStyleWater from '../../img/text2Img/water@2x.png';
import iconStyleOil from '../../img/text2Img/oil@2x.png';
import iconRatioSqure from '../../img/text2Img/square.svg';
import iconRatioSqure_purple from '../../img/text2Img/square_purple.svg';
import iconRatioHorizontal from '../../img/text2Img/horizontal.svg';
import iconRatioHorizontal_purple from '../../img/text2Img/horizontal_purple.svg';
import iconRatioVertical from '../../img/text2Img/vertical.svg';
import iconRatioVertical_purple from '../../img/text2Img/vertical_purple.svg';
import iconCreatingWhite from '../../img/ico_creating_text_white.svg';
import {
  alignItemCenter,
  alignItemStart,
  flexColumn,
  flexGrow,
  flexShrink,
  grid,
  justiCenter,
  purpleBtnCss
} from '../../style/cssCommon';
import { RowContainer, SubTitleArea } from '../../views/ImageCreate';
import SubTitle from '../SubTitle';
import ShowResult from '../ShowResult';
import { useAppDispatch } from '../../store/store';
import {
  T2IOptionType,
  T2IType,
  updateT2ICurItemIndex,
  updateT2ICurListId
} from '../../store/slices/txt2imgHistory';
import ExTextbox from '../ExTextbox';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const MakingInputWrapper = styled.div`
  ${flexColumn}
  gap: 16px;
`;

const GridContainer = styled.div<{
  cssExt?: any;
}>`
  ${grid}

  -webkit-grid-columns: repeat(auto-fit,minmax(81px, auto));
  grid-template-columns: repeat(auto-fit, minmax(81px, auto));

  width: 100%;
  gap: 16px 8px;

  ${({ cssExt }) => cssExt && cssExt}
`;

const SelectOptionArea = styled.div`
  width: 100%;
  ${flexColumn}

  gap: 8px;
`;

const ContainerItem = styled.div`
  ${flexColumn}
  ${alignItemStart}

  gap: 8px;
`;

const RatioBtnConatainer = styled.div`
  ${flexColumn}
  ${flexShrink}
  ${flexGrow}

  width: 100%;
`;

const ItemTitle = styled.div<{ isSelected: boolean }>`
  ${justiCenter}
  ${alignItemCenter}
  width: 100%;

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

export const styleItemList = [
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

export const ratioItemList = [
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

const ImageCreateInput = ({
  contents,
  history,
  createAiImage
}: {
  contents: string;
  history: T2IType[];
  createAiImage: Function;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [selectedOptions, setSelectedOptions] = useState<T2IOptionType>({
    input: contents,
    style: styleItemList[0].id,
    ratio: ratioItemList[0].id
  });
  const { input, style, ratio } = selectedOptions;

  return (
    <MakingInputWrapper>
      <SelectOptionArea>
        <SubTitleArea>
          <SubTitle subTitle={t(`Txt2ImgTab.WritingImageDesc`)} />
          <ShowResult
            disable={history.length === 0}
            onClick={() => {
              dispatch(updateT2ICurListId(history[0].id));
              dispatch(updateT2ICurItemIndex(0));
            }}
          />
        </SubTitleArea>
        <ExTextbox
          placeholder={t(`Txt2ImgTab.WriteImageDesc`) || ''}
          exampleList={exampleList}
          maxtTextLen={1000}
          value={input}
          setValue={(val: string) => {
            setSelectedOptions((prev) => ({ ...prev, input: val }));
          }}
        />
      </SelectOptionArea>
      <SelectOptionArea>
        <SubTitleArea>
          <SubTitle subTitle={t('Txt2ImgTab.ChooseStyle')} />
        </SubTitleArea>
        <GridContainer>
          {styleItemList.map((item) => {
            return (
              <ContainerItem
                key={item.id}
                onClick={() => setSelectedOptions((prev) => ({ ...prev, style: item.id }))}>
                <div>
                  <ItemIconBox
                    cssExt={css`
                      border: ${item.id === 'none' &&
                      item.id === style &&
                      'solid 1px var(--ai-purple-80-sub)'};

                      width: 81px;
                      height: 80px;
                    `}
                    isSelected={item.id === style}>
                    <img
                      style={{
                        width: item.id === 'none' ? '24px' : '100%',
                        height: item.id === 'none' ? '24px' : '100%'
                      }}
                      src={item.id === style ? item.selectedImgItem : item.imgItem}
                      alt=""></img>
                  </ItemIconBox>
                  <ItemTitle isSelected={item.id === style}>
                    {t(`Txt2ImgTab.StyleList.${item.title}`)}
                  </ItemTitle>
                </div>
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
          <GridContainer
            cssExt={css`
              -webkit-grid-columns: 1fr 1fr 1fr 1fr;
              grid-template-columns: 1fr 1fr 1fr 1fr;

              grid-template-columns: repeat(auto-fit, minmax(81px, 4));
            `}>
            {ratioItemList.map((item) => {
              return (
                <ContainerItem
                  key={item.id}
                  onClick={() => setSelectedOptions((prev) => ({ ...prev, ratio: item.id }))}>
                  <RatioBtnConatainer>
                    <ItemIconBox
                      cssExt={css`
                        border: ${item.id === ratio && 'solid 1px var(--ai-purple-80-sub)'};
                        padding: 12px 0px;

                        ${flexShrink}
                        ${flexGrow}
                            width: 100%;
                      `}
                      isSelected={item.id === ratio}>
                      <img
                        src={item.id === ratio ? item.selectedImgItem : item.imgItem}
                        alt=""></img>
                    </ItemIconBox>
                    <ItemTitle isSelected={item.id === ratio}>
                      {t(`Txt2ImgTab.RatioList.${item.title}`)}
                    </ItemTitle>
                  </RatioBtnConatainer>
                </ContainerItem>
              );
            })}
          </GridContainer>
        </RowContainer>
      </SelectOptionArea>
      <Button
        isCredit={true}
        icon={iconCreatingWhite}
        onClick={() => createAiImage(selectedOptions)}
        disable={input.length === 0}
        cssExt={css`
          width: 100%;
          box-sizing: border-box;
          flex: none;
          ${purpleBtnCss}
        `}>
        {t(`Txt2ImgTab.CreateImage`)}
      </Button>
    </MakingInputWrapper>
  );
};

export default ImageCreateInput;
