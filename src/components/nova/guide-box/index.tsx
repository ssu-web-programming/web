import { ReactNode } from 'react';
import CreditIcon from 'img/light/ico_credit_gray.svg';
import { themeInfoSelector } from 'store/slices/theme';
import { userInfoSelector } from 'store/slices/userInfo';
import { useAppSelector } from 'store/store';

import * as S from './style';

interface Props {
  guideTitle: string;
  guideMsg: string;
  creditCount?: number;
  lightIcon?: ReactNode;
  darkIcon?: ReactNode;
}

export default function GuideBox({
  guideMsg,
  guideTitle,
  creditCount = 30,
  lightIcon,
  darkIcon
}: Props) {
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const { isLightMode } = useAppSelector(themeInfoSelector);

  return (
    <S.ImageBox>
      <S.Icon disable={isAgreed === undefined}>{isLightMode ? lightIcon : darkIcon}</S.Icon>

      <S.Guide>
        <S.GuideTitle>{guideTitle}</S.GuideTitle>
        <S.GuideSubTitle>{guideMsg}</S.GuideSubTitle>
      </S.Guide>

      <S.Credit>
        <div className="img">
          <img src={CreditIcon} alt="credit" />
        </div>
        <span>{creditCount}</span>
      </S.Credit>
    </S.ImageBox>
  );
}
