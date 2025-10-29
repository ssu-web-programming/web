import { useTranslation } from 'react-i18next';

import LockAndKeyIcon from '../../img/common/lock_and_key.png';
import CloseDarkIcon from '../../img/dark/ico_nova_close.svg';
import CloseLightIcon from '../../img/light/ico_nova_close.svg';
import { appStateSelector } from '../../store/slices/appState';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppSelector } from '../../store/store';
import Bridge from '../../util/bridge';

import * as S from './style';

export default function RequestLogin() {
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { isNotLogin } = useAppSelector(appStateSelector);

  if (!isNotLogin) return null;

  return (
    <S.Dim>
      <S.LoginWrap>
        <S.Content>
          <img src={LockAndKeyIcon} alt="lock_and_key" />
          <p
            dangerouslySetInnerHTML={{ __html: t('Nova.Home.requestLogin') || '' }}
            onClick={() => Bridge.callBridgeApi('requestLogin')}
          />
        </S.Content>
        <img
          src={isLightMode ? CloseLightIcon : CloseDarkIcon}
          alt="close"
          className="close"
          onClick={() => Bridge.callBridgeApi('closeNova')}
        />
      </S.LoginWrap>
    </S.Dim>
  );
}
