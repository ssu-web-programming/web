import React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import Button from '../../components/buttons/Button';
import ArrowRightIcon from '../../img/common/ico_arrow_right.svg';
import NoneFileDarkIcon from '../../img/dark/none_file.svg';
import NovaLogoDarkIcon from '../../img/dark/nova/ico_logo_nova_with_text.svg';
import NoneFileLightIcon from '../../img/light/none_file.svg';
import NovaLogoLightIcon from '../../img/light/nova/ico_logo_nova_with_text.svg';
import { lang } from '../../locale';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppSelector } from '../../store/store';

import * as S from './style';

const InvalidAccess = () => {
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);

  return (
    <S.Wrapper>
      <S.EmptyWrapper>
        <img
          src={isLightMode ? NovaLogoLightIcon : NovaLogoDarkIcon}
          alt="logo"
          width={107}
          height={40}
        />
        <S.EmptyBox>
          <img src={isLightMode ? NoneFileLightIcon : NoneFileDarkIcon} alt="none-file" />
          <span>{t(`Nova.aiChat.ShareChat.NotValidPage`)}</span>
        </S.EmptyBox>
        <Button
          variant="purple"
          width={328}
          height={48}
          onClick={() => {
            window.open(`https://www.polarisoffice.com/${lang}`, '_blank', 'noopener,noreferrer');
          }}
          cssExt={css``}>
          {t(`Nova.aiChat.ShareChat.MovePOPage`)}
          <img src={ArrowRightIcon} alt="arrow-left" />
        </Button>
      </S.EmptyWrapper>
    </S.Wrapper>
  );
};

export default InvalidAccess;
