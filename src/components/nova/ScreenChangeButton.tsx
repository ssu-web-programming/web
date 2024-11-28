import { useEffect, useState } from 'react';
import { ReactComponent as IconMax } from 'img/ico_nova_max.svg';
import { ReactComponent as IconMin } from 'img/ico_nova_min.svg';
import { useLocation } from 'react-router-dom';

import { DeviceType, platformInfoSelector } from '../../store/slices/platformInfo';
import { useAppSelector } from '../../store/store';
import Bridge, { isDesktop } from '../../util/bridge';
import IconButton from '../buttons/IconButton';
import useLangParameterNavigate from '../hooks/useLangParameterNavigate';

export const ScreenChangeButton = () => {
  const location = useLocation();
  const [status, setStatus] = useState('min');
  const { platform, device } = useAppSelector(platformInfoSelector);
  const { from } = useLangParameterNavigate();

  useEffect(() => {
    if (location.state) {
      const { screenMode } = location.state.body;
      setStatus(screenMode);
    }
  }, [location.state]);

  if (
    ((platform === 'unknown' || platform === 'web' || isDesktop) && from === 'home') ||
    ((platform === 'android' || platform === 'ios') && device === DeviceType.phone)
  ) {
    return (
      <IconButton
        iconComponent={status === 'min' ? IconMax : IconMin}
        onClick={() => {
          Bridge.callBridgeApi('changeScreenSize', status === 'min' ? 'max' : 'min');
          setStatus(status === 'min' ? 'max' : 'min');
        }}
        iconSize="lg"
        width={32}
        height={32}
      />
    );
  }

  return null;
};
