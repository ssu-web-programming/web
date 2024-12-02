import { useMemo } from 'react';
import IconTextButton from 'components/buttons/IconTextButton';
import SelectModelButton from 'components/buttons/select-model-button';
import icon_credit_outline from 'img/ico_credit_outline.svg';
import { ReactComponent as IconStyleNone } from 'img/text2Img/non_select.svg';
import { useTranslation } from 'react-i18next';
import { creditInfoSelector } from 'store/slices/creditInfo';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { getIconColor } from 'util/getColor';

import iconStyle3d from '../../img/text2Img/3d@2x.png';
import iconStyleAni from '../../img/text2Img/ani@2x.png';
import iconStyleConcept from '../../img/text2Img/concept@2x.png';
import { ReactComponent as RatioHorizontal } from '../../img/text2Img/horizontal.svg';
import iconStyleOil from '../../img/text2Img/oil@2x.png';
import iconStylePhoto from '../../img/text2Img/photo@2x.png';
import iconStyleRet from '../../img/text2Img/ret@2x.png';
import { ReactComponent as RatioSqure } from '../../img/text2Img/square.svg';
import { ReactComponent as RatioVertical } from '../../img/text2Img/vertical.svg';
import iconStyleWater from '../../img/text2Img/water@2x.png';
import {
  T2IOptionType,
  T2IType,
  updateT2ICurItemIndex,
  updateT2ICurListId,
  VersionType
} from '../../store/slices/txt2imgHistory';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { RowContainer, SubTitleArea } from '../../views/ImageCreate';
import IconBoxTextButton from '../buttons/IconBoxTextButton';
import ShowResultButton from '../buttons/ShowResultButton';
import ExTextbox from '../ExTextbox';
import Grid from '../layout/Grid';
import SubTitle from '../SubTitle';

const MakingInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GridContainer = styled.div<{
  cssExt?: FlattenSimpleInterpolation;
}>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(81px, 1fr));

  width: 100%;
  gap: 8px 0px;
`;

const SelectOptionArea = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  gap: 8px;
`;

const ContainerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;
`;

const ItemTitle = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  font-weight: bold;
  font-size: 12px;
  font-weight: normal;
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
  cssExt?: FlattenSimpleInterpolation;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: var(--gray-gray-20);
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: var(--ai-purple-97-list-over);
    padding: 2px;
  }

  ${({ width, height }) => css`
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

  ${(props) => props.cssExt || ''};
`;

const StyledCreditButton = styled.div`
  button {
    height: 40px;
  }
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
    imgItem: IconStyleNone
  },
  {
    id: 'photographic',
    title: 'Picture',
    imgItem: iconStylePhoto
  },
  {
    id: 'fantasy-art',
    title: 'ConceptArt',
    imgItem: iconStyleConcept
  },
  {
    id: '3d-model',
    title: '3D',
    imgItem: iconStyle3d
  },
  {
    id: 'anime',
    title: 'Anime',
    imgItem: iconStyleAni
  },
  {
    id: 'x-po-retro',
    title: 'Retro',
    imgItem: iconStyleRet
  },
  {
    id: 'x-po-watercolor-painting',
    title: 'WaterPainting',
    imgItem: iconStyleWater
  },
  {
    id: 'x-po-oil-painting',
    title: 'OilPainting',
    imgItem: iconStyleOil
  }
];

export const ratioItemList = [
  {
    id: '1024x1024',
    title: 'Squre',
    imgItem: RatioSqure
  },
  {
    id: '1792x1024',
    title: 'Horizontal',
    imgItem: RatioHorizontal
  },
  {
    id: '1024x1792',
    title: 'Vertical',
    imgItem: RatioVertical
  }
];

export const versionItemList = [
  {
    id: VersionType.dalle3,
    title: 'DALL-E-3',
    desc: '창의적이고 디테일한 이미지를 잘 생성해요',
    creditValue: 'DREAM_STUDIO'
  },
  {
    id: VersionType.sd3,
    title: 'Stable Diffusion 3',
    desc: '폭넓은 스타일의 이미지를 빠르게 생성해요',
    creditValue: 'TEXTTOIMAGE_DALLE3'
  }
];

const ImageCreateInput = ({
  options,
  setOptions,
  history,
  createAiImage
}: {
  options: T2IOptionType;
  setOptions: React.Dispatch<React.SetStateAction<T2IOptionType>>;
  history: T2IType[];
  createAiImage: (option: T2IOptionType) => void;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const creditInfo = useAppSelector(creditInfoSelector);
  const { input, style, ratio } = options;

  const versionList = useMemo(
    () =>
      versionItemList.map((info) => ({
        ...info,
        deductCredit: creditInfo.find((item) => item.serviceType === info.creditValue)?.deductCredit
      })),
    [creditInfo]
  );

  console.log('versionList', versionList);

  return (
    <MakingInputWrapper>
      <SelectOptionArea>
        <SubTitleArea>
          <SubTitle subTitle={t(`Txt2ImgTab.WritingImageDesc`)} />
          <ShowResultButton
            disable={history.length === 0}
            onClick={() => {
              const last = history[history.length - 1];
              if (last) {
                dispatch(updateT2ICurListId(last.id));
                dispatch(updateT2ICurItemIndex(0));
              }
            }}
          />
        </SubTitleArea>
        <ExTextbox
          placeholder={t(`Txt2ImgTab.WriteImageDesc`) || ''}
          exampleList={exampleList}
          maxTextLen={1000}
          value={input}
          setValue={(val: string) => {
            setOptions((prev) => ({ ...prev, input: val }));
          }}
        />
      </SelectOptionArea>
      <SelectOptionArea>
        <SubTitleArea>
          <SubTitle subTitle={t('Txt2ImgTab.SelectType')} />
        </SubTitleArea>
        <RowContainer>
          {versionList.map((item) => (
            <SelectModelButton
              key={item.id}
              item={item}
              selected={item.id === options.type}
              onClick={() => setOptions((prev) => ({ ...prev, type: item.id }))}
            />
          ))}
        </RowContainer>
      </SelectOptionArea>
      <SelectOptionArea>
        <SubTitleArea>
          {/* 호진FIXME: 다국어 적용 진행해야함! */}
          <SubTitle subTitle={t('Txt2ImgTab.ChooseStyle')} />
        </SubTitleArea>
        <GridContainer>
          {styleItemList.map((item) => {
            return (
              <ContainerItem
                key={item.id}
                onClick={() => setOptions((prev) => ({ ...prev, style: item.id }))}>
                <ItemIconBox
                  cssExt={css`
                    border: ${item.id === 'none' &&
                    item.id === style &&
                    'solid 1px var(--ai-purple-80-sub)'};
                    width: 76px;
                    height: 76px;
                  `}
                  isSelected={item.id === style}>
                  {item.id === 'none' ? (
                    <item.imgItem
                      color={getIconColor(item.id, style, {
                        selected: 'var(--ai-purple-50-main)',
                        default: '#979797'
                      })}
                    />
                  ) : (
                    <img
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      src={item.imgItem as string}
                      alt={item.title}
                    />
                  )}
                </ItemIconBox>
                <ItemTitle isSelected={item.id === style}>
                  {t(`Txt2ImgTab.StyleList.${item.title}`)}
                </ItemTitle>
              </ContainerItem>
            );
          })}
        </GridContainer>
      </SelectOptionArea>
      <SelectOptionArea>
        <SubTitleArea>
          {/* 호진FIXME: 다국어 적용 진행해야함! */}
          <SubTitle subTitle={t('Txt2ImgTab.ChooseRatio')} />
        </SubTitleArea>
        <RowContainer>
          <Grid col={3}>
            {ratioItemList.map((item) => (
              <IconBoxTextButton
                key={item.id}
                variant="gray"
                width="full"
                iconSize="md"
                iconSrc={<item.imgItem color={getIconColor(item.id, ratio)} />}
                onClick={() => setOptions((prev) => ({ ...prev, ratio: item.id }))}
                selected={item.id === ratio}
                iconPos="top"
                cssExt={css`
                  padding: 8px;
                  height: 69px;
                `}
                innerText>
                <p
                  style={{
                    paddingTop: 6
                  }}>
                  {t(`Txt2ImgTab.RatioList.${item.title}`)}
                </p>
              </IconBoxTextButton>
            ))}
          </Grid>
        </RowContainer>
      </SelectOptionArea>
      <StyledCreditButton>
        <IconTextButton
          width="full"
          variant={input.length === 0 ? 'darkGray' : 'purple'}
          onClick={() => {
            createAiImage(options);
          }}
          disable={input.length === 0}
          iconSrc={icon_credit_outline}
          iconSize={18}
          iconPos="end">
          <div style={{ display: 'flex', gap: '5px' }}>{t(`Txt2ImgTab.CreateImage`)}</div>
        </IconTextButton>
      </StyledCreditButton>
    </MakingInputWrapper>
  );
};

export default ImageCreateInput;
