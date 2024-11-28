import { ReactComponent as IconMax } from 'img/ico_nova_max.svg';
import { ReactComponent as IconMin } from 'img/ico_nova_min.svg';

import { DeviceType, platformInfoSelector } from '../../store/slices/platformInfo';
import { screenModeSelector, setScreenMode } from '../../store/slices/screenMode';
import { useAppSelector } from '../../store/store';
import Bridge, { isDesktop } from '../../util/bridge';
import IconButton from '../buttons/IconButton';
import useLangParameterNavigate from '../hooks/useLangParameterNavigate';

export const ScreenChangeButton = () => {
  const { screenMode } = useAppSelector(screenModeSelector);
  const { platform, device } = useAppSelector(platformInfoSelector);
  const { from } = useLangParameterNavigate();

  if (
    ((platform === 'unknown' || platform === 'web' || isDesktop) && from === 'home') ||
    ((platform === 'android' || platform === 'ios') && device === DeviceType.phone)
  ) {
    return (
      <IconButton
        iconComponent={screenMode === 'min' ? IconMax : IconMin}
        onClick={() => {
          Bridge.callBridgeApi('changeScreenSize', screenMode === 'min' ? 'max' : 'min');
          setScreenMode(screenMode === 'min' ? 'max' : 'min');
        }}
        iconSize="lg"
        width={32}
        height={32}
      />
    );
  }

  return null;
};
