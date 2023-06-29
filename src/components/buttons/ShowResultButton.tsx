import icon_arrow_right from '../../img/ico_front.svg';
import { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import IconTextButton from './IconTextButton';

interface ShowResultButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disable?: boolean;
}

export default function ShowResultButton({ onClick, disable }: ShowResultButtonProps) {
  const { t } = useTranslation();

  return (
    <IconTextButton
      iconSrc={icon_arrow_right}
      iconPos="right"
      variant="transparent"
      width="fit"
      height={26}
      cssExt={css`
        font-size: 12px;
        color: var(--gray-gray-80-02);
      `}
      disable={disable}
      onClick={onClick}>
      {t(`ShowResult`)}
    </IconTextButton>
  );
}
