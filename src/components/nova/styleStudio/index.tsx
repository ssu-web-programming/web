import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import style3DCharacter from '../../../img/common/nova/styleStudio/style_3d.png';
import styleAnimalCrossing from '../../../img/common/nova/styleStudio/style_animalcrossing.png';
import styleDisney from '../../../img/common/nova/styleStudio/style_disney.png';
import styleGibli from '../../../img/common/nova/styleStudio/style_ghibli.png';
import styleLego from '../../../img/common/nova/styleStudio/style_lego.png';
import styleMarvel from '../../../img/common/nova/styleStudio/style_marvel.png';
import stylePixar from '../../../img/common/nova/styleStudio/style_pixar.png';
import styleSailorMoon from '../../../img/common/nova/styleStudio/style_sailormoon.png';
import styleJjanggu from '../../../img/common/nova/styleStudio/style_shinchan.png';
import styleSimpson from '../../../img/common/nova/styleStudio/style_simpson.png';
import { ReactComponent as BangIcon } from '../../../img/light/bang_circle.svg';
import { selectPageData } from '../../../store/slices/nova/pageStatusSlice';
import { useAppSelector } from '../../../store/store';
import Button from '../../buttons/Button';
import { useGenerateStyleStudio } from '../../hooks/nova/use-generate-style-studio';
import ImageUploadGuide from '../../image-upload-guide';
import FileItem from '../file-item';

import * as S from './style';

interface IStyle {
  src: string;
  label: string;
  id: string;
}

const StyleStudio = () => {
  const { t } = useTranslation();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.styleStudio));
  const { handleGenerateStyle } = useGenerateStyleStudio();

  const styleImages: IStyle[] = [
    { src: styleGibli, label: t('Nova.styleStudio.SelectStyle.Style.Ghibli'), id: 'ghibli' },
    { src: styleDisney, label: t('Nova.styleStudio.SelectStyle.Style.Disney'), id: 'disney' },
    { src: stylePixar, label: t('Nova.styleStudio.SelectStyle.Style.Pixar'), id: 'pixar' },
    { src: styleMarvel, label: t('Nova.styleStudio.SelectStyle.Style.Marvel'), id: 'marvel' },
    {
      src: styleAnimalCrossing,
      label: t('Nova.styleStudio.SelectStyle.Style.AnimalCrossing'),
      id: 'animal_crossing'
    },
    {
      src: styleSailorMoon,
      label: t('Nova.styleStudio.SelectStyle.Style.SailorMoon'),
      id: 'sailor_moon'
    },
    { src: styleJjanggu, label: t('Nova.styleStudio.SelectStyle.Style.Shinchan'), id: 'shinchan' },
    { src: styleSimpson, label: t('Nova.styleStudio.SelectStyle.Style.Simpsons'), id: 'simpsons' },
    { src: styleLego, label: t('Nova.styleStudio.SelectStyle.Style.Lego'), id: 'lego' },
    {
      src: style3DCharacter,
      label: t('Nova.styleStudio.SelectStyle.Style.Figurine'),
      id: 'figurine'
    }
  ];

  const [selectedStyle, setSelectedStyle] = useState<IStyle>(styleImages[0]);
  const [prompt, setPrompt] = useState('');

  const isDisabled = () => {
    const trimmed = prompt.trim();
    const hasNormalChar = /[a-zA-Z0-9가-힣]/.test(trimmed);
    return (trimmed === '' || trimmed.length < 10 || !hasNormalChar) && !currentFile?.file;
  };

  return (
    <S.Wrapper>
      <S.TitleWrap>
        <S.MainTitle>{t('Nova.styleStudio.Guide.Title')}</S.MainTitle>
        <S.MainDesc>{t('Nova.styleStudio.Guide.SubTitle')}</S.MainDesc>
      </S.TitleWrap>

      <S.ContentArea>
        {/* 스타일 선택 */}
        <S.StyleSectionBox>
          <S.SectionTitle>{t('Nova.styleStudio.SelectStyle.CharStyle')}</S.SectionTitle>
          <S.StyleGrid>
            {styleImages.map((item) => (
              <S.StyleItem key={item.id} onClick={() => setSelectedStyle(item)}>
                <S.ThumbnailWrap>
                  <S.OuterBorder isSelected={selectedStyle.id === item.id} />
                  <S.InnerBorder isSelected={selectedStyle.id === item.id} />
                  <S.Thumbnail src={item.src} alt={item.label} />
                </S.ThumbnailWrap>
                <S.StyleLabel>{item.label}</S.StyleLabel>
              </S.StyleItem>
            ))}
          </S.StyleGrid>
          <S.GuideText>{t('Nova.styleStudio.SelectStyle.StyleGuide')}</S.GuideText>
        </S.StyleSectionBox>

        {/* 이미지 첨부 */}
        <S.UploadBox>
          <S.InputTitle>{t('Nova.styleStudio.SelectStyle.UploadImage.Title')}</S.InputTitle>
          {currentFile?.file ? (
            <S.UploadedBox>
              <FileItem fileName={currentFile.info} isDeleteIcon={true} iconSize={48} />
            </S.UploadedBox>
          ) : (
            <ImageUploadGuide
              handleUploadComplete={() => {}}
              showSimpleGuide={true}
              type="styleStudio"
            />
          )}
        </S.UploadBox>

        {/* 이미지 설명 */}
        <S.InputBox>
          <S.InputTitle>{t('Nova.styleStudio.SelectStyle.Desc.Title')}</S.InputTitle>
          <S.TextAreaWrap>
            <S.InputTextarea
              placeholder={t('Nova.styleStudio.SelectStyle.Desc.PlaceHolder') || ''}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <S.InputSubGuide
              dangerouslySetInnerHTML={{
                __html: t('Nova.styleStudio.SelectStyle.Desc.SubTitle') || ''
              }}
            />
          </S.TextAreaWrap>
        </S.InputBox>

        {/* 가이드 메시지 */}
        <S.Footer>
          <S.GuideMessage>
            <S.IconWrap>
              <BangIcon />
            </S.IconWrap>
            <span>{t('Nova.styleStudio.SelectStyle.Warning')}</span>
          </S.GuideMessage>

          {/* 생성 버튼 */}
          <Button
            variant="purple"
            width={'full'}
            height={48}
            onClick={() => handleGenerateStyle(selectedStyle.id, prompt)}
            disable={isDisabled()}
            cssExt={css`
              font-size: 16px;
              font-weight: 500;
            `}>
            {t('Nova.styleStudio.SelectStyle.Button')}
          </Button>
        </S.Footer>
      </S.ContentArea>
    </S.Wrapper>
  );
};

export default StyleStudio;
