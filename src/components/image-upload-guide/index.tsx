import React from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as UploadDarkIcon } from '../../img/dark/ico_upload_img_plus.svg';
import CreditIcon from '../../img/light/ico_credit_gray.svg';
import { ReactComponent as UploadLightIcon } from '../../img/light/ico_upload_img_plus.svg';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { themeInfoSelector } from '../../store/slices/theme';
import { userInfoSelector } from '../../store/slices/userInfo';
import { useAppSelector } from '../../store/store';
import ImageUploader from '../nova/ImageUploader';

import * as S from './style';

interface ImageUploadGuideProps {
  handleUploadComplete?: () => void;
  showSimpleGuide?: boolean;
}

const ImageUploadGuide = ({
  handleUploadComplete,
  showSimpleGuide = false
}: ImageUploadGuideProps) => {
  const { t } = useTranslation();
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  return (
    <ImageUploader handleUploadComplete={handleUploadComplete}>
      <S.ImageBox>
        <S.Icon disable={isAgreed === undefined}>
          {isLightMode ? <UploadLightIcon /> : <UploadDarkIcon />}
          {!showSimpleGuide && <span>{t(`Nova.UploadTooltip.UploadImage`)}</span>}
        </S.Icon>
        {!showSimpleGuide && (
          <S.Credit>
            <span>10</span>
            <div className="img">
              <img src={CreditIcon} alt="credit" />
            </div>
          </S.Credit>
        )}
        <S.Guide>{t(`Nova.${selectedNovaTab}.Guide.ImgUploader`)}</S.Guide>
      </S.ImageBox>
    </ImageUploader>
  );
};

export default ImageUploadGuide;
