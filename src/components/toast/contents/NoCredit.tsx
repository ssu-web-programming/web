import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { openNewWindow } from '../../../util/common';

const TextLink = styled.p`
  &:hover {
    cursor: pointer;
  }
`;

export default function NoCredit({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div>
      {children ? children : <p>{t(`ToastMsg.UsedAllCredit`)}</p>}
      <TextLink
        onClick={() => {
          openNewWindow(`credit`);
        }}>
        {t(`ToastMsg.CheckCreditPolicy`)}
      </TextLink>
    </div>
  );
}
