import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { SERVICE_CATEGORY, SERVICE_GROUP_MAP } from '../../../constants/serviceType';
import CreditDarkIcon from '../../../img/dark/ico_credit_gray.svg';
import { ReactComponent as IconConvertDark } from '../../../img/dark/nova/tab/convert_Img.svg';
import CreditLightIcon from '../../../img/light/ico_credit_gray.svg';
import { ReactComponent as IconConvertLight } from '../../../img/light/nova/tab/convert_Img.svg';
import { lang } from '../../../locale';
import { initFlagSelector } from '../../../store/slices/initFlagSlice';
import { selectAllServiceCredits } from '../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { useAppSelector } from '../../../store/store';

import * as S from './style';

export default function CreditInfo() {
  const { t } = useTranslation();
  const { isInit } = useAppSelector(initFlagSelector);
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const serviceCredits = useAppSelector(selectAllServiceCredits);
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<SERVICE_CATEGORY>(SERVICE_CATEGORY.CHAT);

  const toggleTooltip = () => {
    if (!isInit) return;

    setIsOpen(!isOpen);
  };

  const handleChange = (event: React.SyntheticEvent, tab: SERVICE_CATEGORY) => {
    setTab(tab);
  };

  const getTabTranslationKey = (tab: string, group: string) => {
    return (
      <Trans
        i18nKey={`Nova.Home.${tab}.${group}`}
        components={{
          img: isLightMode ? <IconConvertLight /> : <IconConvertDark />
        }}
      />
    );
  };

  return (
    <S.TooltipContainer>
      <S.CreditIcon $isInit={isInit} onClick={toggleTooltip} />
      {isOpen && (
        <S.TooltipWrap $isWide={lang != 'ko'}>
          <S.Title>{t('Nova.Home.creditGuide')}</S.Title>
          <S.Content>
            <S.CustomTabs value={tab} onChange={handleChange}>
              {Object.values(SERVICE_CATEGORY).map((category, index) => (
                <S.CustomTab
                  key={category}
                  label={t(`Nova.Home.${category.toLowerCase()}.title`)}
                  value={category}
                  $isDivider={
                    (tab === SERVICE_CATEGORY.CHAT && index === 1) ||
                    (tab === SERVICE_CATEGORY.IMAGE && index === 0)
                  }
                />
              ))}
            </S.CustomTabs>
            <S.List>
              {Object.entries(SERVICE_GROUP_MAP[tab] || {}).map(([group, services], index) => {
                const credits = services
                  .map((service) => serviceCredits[service] ?? 0)
                  .filter((c) => c > 0);

                if (credits.length === 0) return null;
                const minCredit = Math.min(...credits);
                const maxCredit = Math.max(...credits);
                return (
                  <li key={index}>
                    <S.Item>
                      <span>{getTabTranslationKey(tab.toLowerCase(), group)}</span>
                      <S.CreditWrap>
                        <img src={isLightMode ? CreditLightIcon : CreditDarkIcon} alt="credit" />
                        <span>
                          {minCredit === maxCredit ? maxCredit : `${minCredit}~${maxCredit}`}
                        </span>
                      </S.CreditWrap>
                    </S.Item>
                  </li>
                );
              })}
            </S.List>
          </S.Content>
        </S.TooltipWrap>
      )}
    </S.TooltipContainer>
  );
}
