import { ReactComponent as UploadDarkIcon } from 'img/dark/ico_upload_img_plus.svg';
import CreditIcon from 'img/light/ico_credit_gray.svg';
import { ReactComponent as UploadFileLightIcon } from 'img/light/nova/translation/file_upload.svg';
import { themeInfoSelector } from 'store/slices/theme';
import { userInfoSelector } from 'store/slices/userInfo';
import { useAppSelector } from 'store/store';

import * as S from './style';

interface Props {
  guideTitle: string;
  guideMsg: string;
  creditCount?: number;
}

export default function GuideBox({ guideMsg, guideTitle, creditCount = 30 }: Props) {
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const { isLightMode } = useAppSelector(themeInfoSelector);

  return (
    <S.ImageBox>
      <S.Icon disable={isAgreed === undefined}>
        {isLightMode ? <UploadFileLightIcon /> : <UploadDarkIcon />}
      </S.Icon>

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
