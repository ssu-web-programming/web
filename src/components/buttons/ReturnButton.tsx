import { css } from 'styled-components';

import icon_recreating from '../../img/light/ico_back.svg';

import IconTextButton from './IconTextButton';

interface ReturnButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ReturnButton(props: React.PropsWithChildren<ReturnButtonProps>) {
  const { onClick, children } = props;
  return (
    <IconTextButton
      iconSrc={icon_recreating}
      iconPos="left"
      variant="transparent"
      width="fit"
      height={26}
      cssExt={css`
        font-size: 12px;
        color: var(--gray-gray-80-02);
      `}
      onClick={onClick}>
      {children}
    </IconTextButton>
  );
}
