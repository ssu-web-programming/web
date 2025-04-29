import * as React from 'react';

import HeyzenLogoDarkIcon from '../../../../../img/dark/nova/logo/ico_heygen_name_logo.svg';
import HeyzenLogoLightIcon from '../../../../../img/light/nova/logo/ico_heygen_name_logo.svg';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppSelector } from '../../../../../store/store';

import * as S from './style';

function HeygenLogo() {
  return (
    <S.LogoWrap>
      <span className="normal">Uses</span>
      <span className="bold"> Heygen</span>
      <span className="normal"> API</span>
    </S.LogoWrap>
  );
}

export default HeygenLogo;
