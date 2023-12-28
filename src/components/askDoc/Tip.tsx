import Icon from '../Icon';
import icon_ai from '../../img/ico_ai.svg';
import styled from 'styled-components';
import { alignItemCenter, flex, flexGrow, flexShrink } from '../../style/cssCommon';

import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

const FloatingBox = styled.div`
  ${flex}
  ${flexGrow}
  ${flexShrink}
  
  position: absolute;
  top: 0px;
  width: 100%;
  transform: translate(0, -100%);
  background-color: transparent;
`;

const Info = styled.div`
  ${flex}
  ${alignItemCenter}

  background-color: var(--ai-purple-99-bg-light);
  color: var(--ai-purple-50-main);
  padding: 0px 16px;
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

  const [chatTip, setChatTip] = useState<string>(
    chatTipList[Math.floor(Math.random() * chatTipList.length)]
  );

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
