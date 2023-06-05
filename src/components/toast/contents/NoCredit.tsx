import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

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
          window._Bridge.openWindow(`credit`);
        }}>
        {t(`ToastMsg.CheckCreditPolicy`)}
      </TextLink>
    </div>
  );
}
