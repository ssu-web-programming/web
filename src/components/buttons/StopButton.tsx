import { css } from 'styled-components';

import icon_stop from '../../img/ico_stop.svg';

import IconTextButton from './IconTextButton';

interface StopButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function StopButton({ onClick }: StopButtonProps) {
  return (
    <IconTextButton
      borderType="gray"
      iconSrc={icon_stop}
      width={73}
      height={28}
      cssExt={css`
        color: #2f3133;
      `}
      onClick={onClick}>
      Stop
    </IconTextButton>
  );
}
