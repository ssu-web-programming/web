import { ReactComponent as MaxDarkIcon } from 'img/dark/nova/ico_max.svg';
import { ReactComponent as MinDarkIcon } from 'img/dark/nova/ico_min.svg';
import { ReactComponent as MaxLightIcon } from 'img/light/nova/ico_max.svg';
import { ReactComponent as MinLightIcon } from 'img/light/nova/ico_min.svg';

import { DeviceType, platformInfoSelector } from '../../store/slices/platformInfo';
import { screenModeSelector, setScreenMode } from '../../store/slices/screenMode';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge, { isDesktop } from '../../util/bridge';
import IconButton from '../buttons/IconButton';
import useLangParameterNavigate from '../hooks/useLangParameterNavigate';

export const ScreenChangeButton = () => {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { screenMode } = useAppSelector(screenModeSelector);
  const { platform, device } = useAppSelector(platformInfoSelector);
  const { from } = useLangParameterNavigate();

  if (
    ((platform === 'unknown' || platform === 'web' || isDesktop) && from === 'home') ||
    ((platform === 'android' || platform === 'ios') && device === DeviceType.phone)
  ) {
    return (
      <IconButton
        iconComponent={
          screenMode === 'min'
            ? isLightMode
              ? MaxLightIcon
              : MaxDarkIcon
            : isLightMode
              ? MinLightIcon
              : MinDarkIcon
        }
        onClick={() => {
          Bridge.callBridgeApi('changeScreenSize', screenMode === 'min' ? 'max' : 'min');
          dispatch(setScreenMode(screenMode === 'min' ? 'max' : 'min'));
        }}
        iconSize="lg"
        width={32}
        height={32}
      />
    );
  }

  return null;
};
