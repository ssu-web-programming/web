import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import icon_ai from '../../img/light/ico_ai.svg';
import Icon from '../Icon';

const FloatingBox = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;

  position: absolute;
  top: 0;
  width: 100%;
  transform: translate(0, -100%);
  background-color: transparent;
`;

const Info = styled.div`
  display: flex;
  align-items: center;

  background-color: var(--ai-purple-99-bg-light);
  color: var(--ai-purple-50-main);
  padding: 0 16px;
  line-height: 100%;
  font-size: 12px;
  height: 48px;
  width: 100%;
  gap: 8px;
`;

export const Tip = () => {
  const { t } = useTranslation();

  const chatTipList = useMemo(() => {
    return ['1ChatingCredit'];
  }, []);

  const [chatTip] = useState<string>(chatTipList[Math.floor(Math.random() * chatTipList.length)]);

  return (
    <FloatingBox>
      <Info>
        <div
          style={{
            display: 'flex',
            width: '16px',
            height: '20px',
            marginRight: '6px'
          }}>
          <Icon iconSrc={icon_ai} />
        </div>
        {t(`AskDoc.TipList.${chatTip}`)}
      </Info>
    </FloatingBox>
  );
};
