import { useState } from 'react';
import { ReactComponent as IconMax } from 'img/ico_nova_max.svg';
import { ReactComponent as IconMin } from 'img/ico_nova_min.svg';

import { platformInfoSelector } from '../../store/slices/platformInfo';
import { useAppSelector } from '../../store/store';
import Bridge from '../../util/bridge';
import IconButton from '../buttons/IconButton';
import useLangParameterNavigate from '../hooks/useLangParameterNavigate';

export const ScreenChangeButton = () => {
  const [status, setStatus] = useState('min');
  const { platform, device } = useAppSelector(platformInfoSelector);
  const { from } = useLangParameterNavigate();

  if (
    ((platform === 'unknown' || platform === 'web') && from === 'home') ||
    (platform === 'android' && device === 'phone')
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
