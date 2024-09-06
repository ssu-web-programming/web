import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import icon_ai_change from '../../img/ico_ai_change.svg';

import IconTextButton from './IconTextButton';

interface ExButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disable: boolean;
}

export default function ChangeExampleButton({ onClick, disable }: ExButtonProps) {
  const { t } = useTranslation();

  return (
    <IconTextButton
      width="fit"
      iconSrc={icon_ai_change}
      cssExt={css`
        font-size: 12px;
        color: var(--gray-gray-80-02);
      `}
      disable={disable}
      onClick={onClick}>
      {t(`ShowExam`)}
    </IconTextButton>
  );
}
