import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlattenSimpleInterpolation } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { getChatGroupKey, getServiceGroupInfo, iconMap } from '../../../constants/serviceType';
import { announceInfoSelector } from '../../../store/slices/nova/announceSlice';
import { novaChatModeSelector } from '../../../store/slices/nova/novaHistorySlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { useAppSelector } from '../../../store/store';
import Announcement from '../../Announcement';

import * as S from './style';

interface GuideProps {
  children: React.ReactNode;
  onClick?: () => void;
  $guideTitleStyle?: FlattenSimpleInterpolation;
}

export const Guide = (props: GuideProps) => {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const announceInfo = useAppSelector(announceInfoSelector(selectedNovaTab));
  const chatMode = useAppSelector(novaChatModeSelector);
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const isChat =
    selectedNovaTab === NOVA_TAB_TYPE.aiChat || selectedNovaTab === NOVA_TAB_TYPE.perplexity;

  const getIcon = () => {
    // TODO: 로고도 함께 관리하도록 수정 필요
    if (selectedNovaTab === NOVA_TAB_TYPE.aiChat || selectedNovaTab === NOVA_TAB_TYPE.perplexity) {
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
        {announceInfo.status && <Announcement content={announceInfo.content} />}
        <S.GuideTitle $guideTitleStyle={props.$guideTitleStyle}>
          <S.GuideImage
            src={getIcon()}
            alt="aiChat"
            onClick={() => {
              props.onClick && props.onClick();
            }}
            $isChat={
              selectedNovaTab === NOVA_TAB_TYPE.aiChat ||
              selectedNovaTab === NOVA_TAB_TYPE.perplexity
            }
          />
          <div className="title">
            <p>
              {isChat
                ? getServiceGroupInfo(getChatGroupKey(chatMode), isLightMode).label
                : t(`Nova.${selectedNovaTab}.Guide.Title`)}
            </p>
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
