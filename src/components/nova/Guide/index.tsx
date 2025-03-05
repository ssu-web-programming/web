import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FlattenSimpleInterpolation } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { getChatGroupKey, getServiceGroupInfo, iconMap } from '../../../constants/serviceType';
import { ReactComponent as IconConvertDark } from '../../../img/dark/nova/tab/convert_Img.svg';
import { ReactComponent as IconConvertLight } from '../../../img/light/nova/tab/convert_Img.svg';
import { novaChatModeSelector } from '../../../store/slices/nova/novaHistorySlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { useAppSelector } from '../../../store/store';

import * as S from './style';

interface GuideProps {
  children: React.ReactNode;
  onClick?: () => void;
  $guideTitleStyle?: FlattenSimpleInterpolation;
}

export const Guide = (props: GuideProps) => {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const chatMode = useAppSelector(novaChatModeSelector);
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const isChat =
    selectedNovaTab === NOVA_TAB_TYPE.aiChat || selectedNovaTab === NOVA_TAB_TYPE.perplexity;

  const getIcon = () => {
    if (isChat) {
      const groupKey = getChatGroupKey(chatMode);
      const info = getServiceGroupInfo(groupKey, isLightMode);
      return info.icon;
    } else {
      return iconMap[selectedNovaTab];
    }
  };

  return (
    <S.Container>
      <S.GuideWrapper>
        <S.GuideTitle $guideTitleStyle={props.$guideTitleStyle}>
          <S.GuideImage
            src={getIcon()}
            alt="aiChat"
            onClick={() => {
              props.onClick && props.onClick();
            }}
            $isChat={isChat}
          />
          <div className="title">
            {isChat ? (
              getServiceGroupInfo(getChatGroupKey(chatMode), isLightMode).label
            ) : (
              <Trans
                i18nKey={t(`Nova.${selectedNovaTab}.Guide.Title`)}
                components={{
                  img: isLightMode ? <IconConvertLight /> : <IconConvertDark />
                }}
              />
            )}
          </div>
          <p className="desc">
            {isChat
              ? t(`Nova.ChatModel.${getChatGroupKey(chatMode)}.desc_home`)
              : t(`Nova.${selectedNovaTab}.Guide.SubTitle`)}
          </p>
        </S.GuideTitle>
        <S.GuideBody>{props.children}</S.GuideBody>
      </S.GuideWrapper>
    </S.Container>
  );
};
