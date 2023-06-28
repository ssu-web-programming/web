import icon_recreating from '../../img/ico_back.svg';
import { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import IconTextButton from './IconTextButton';

interface ReturnButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ReturnButton({ onClick }: ReturnButtonProps) {
  const { t } = useTranslation();

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
      {t(`WriteTab.ReEnterTopic`)}
    </IconTextButton>
  );
}
