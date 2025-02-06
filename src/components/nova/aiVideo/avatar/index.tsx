import { useState } from 'react';
import { css } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import { ReactComponent as CheckIcon } from '../../../../img/common/ico_check.svg';
import DownloadIcon from '../../../../img/light/ico_download_white.svg';
import Composition from '../../../../img/light/nova/changeStyle/change_style_composition.png';
import Mosaic from '../../../../img/light/nova/changeStyle/change_style_mosaic.png';
import Scream from '../../../../img/light/nova/changeStyle/change_style_scream.png';
import Starry from '../../../../img/light/nova/changeStyle/change_style_starry.png';
import PlusDocLightIcon from '../../../../img/light/upload_img_plus_new.svg';
import Button from '../../../buttons/Button';
import ImageUploader from '../../ImageUploader';

import * as S from './style';

export default function Avatar() {
  const [selectedAvartar, setSelectedAvatar] = useState<{ src: string; alt: string } | null>(null);

  const images = [
    { src: Composition, alt: 'composition' },
    { src: Mosaic, alt: 'mosaic' },
    { src: Starry, alt: 'starry-night' },
    { src: Scream, alt: 'the-scream' }
  ];

  const handleImageClick = (src: string, alt: string) => {
    setSelectedAvatar({ src, alt });
  };

  return (
    <S.Container>
      <S.AvatarCard />
      <S.ContentWrap>
        <S.AvatarSelectBox>
          <S.TitleWrap>
            <span>아바타 선택</span>
            <span>더 보기</span>
          </S.TitleWrap>
          <S.AvartarList>
            {images.map((image) => (
              <S.AvartarContainer key={image.src} isSelected={selectedAvartar?.src === image.src}>
                <S.OuterBorder isSelected={selectedAvartar?.src === image.src} />
                {selectedAvartar?.src === image.src && (
                  <S.CheckBox>
                    <CheckIcon />
                  </S.CheckBox>
                )}
                <S.Image
                  src={image.src}
                  alt={image.alt}
                  onClick={() => handleImageClick(image.src, image.alt)}
                />
              </S.AvartarContainer>
            ))}
          </S.AvartarList>
          <ImageUploader handleUploadComplete={() => {}} curTab={NOVA_TAB_TYPE.aiVideo}>
            <S.UploadInner>
              <img src={PlusDocLightIcon} alt="doc_plus" />
              <S.ImageUploadGuide>
                <span className="title">나만의 아바타 만들기</span>
                <span className="desc">JPG, PNG 형식, 최대 50MB 지원</span>
              </S.ImageUploadGuide>
            </S.UploadInner>
          </ImageUploader>
        </S.AvatarSelectBox>
        <S.TitleWrap>
          <span>이미지 형태</span>
          <span>사각형 원형</span>
        </S.TitleWrap>
        <Button
          variant="purple"
          width={'full'}
          height={48}
          cssExt={css`
            display: flex;
            gap: 4px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
          `}
          onClick={() => {}}>
          <span>{'AI 비디오 만들기'}</span>
        </Button>
      </S.ContentWrap>
    </S.Container>
  );
}
