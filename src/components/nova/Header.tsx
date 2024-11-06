import React from 'react';
import { ReactComponent as IconLogoNova } from 'img/ico_logo_nova.svg';
import { ReactComponent as IconMessagePlus } from 'img/ico_message_plus.svg';
import { ReactComponent as IconClose } from 'img/ico_nova_close.svg';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import ico_credit from '../../img/ico_credit_gray.svg';
import ico_credit_info from '../../img/ico_credit_line.svg';
import { creditInfoSelector, InitialState } from '../../store/slices/creditInfo';
import { novaHistorySelector } from '../../store/slices/nova/novaHistorySlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge, { isDesktop } from '../../util/bridge';
import IconButton from '../buttons/IconButton';
import { useConfirm } from '../Confirm';
import { useChatNova } from '../hooks/useChatNova';
import Icon from '../Icon';
import Header from '../layout/Header';
import Tooltip from '../Tooltip';

import { ScreenChangeButton } from './ScreenChangeButton';

const flexCenter = css`
  display: flex;
  align-items: center;
`;

const StyledHeader = styled(Header)`
  width: 100%;
  color: var(--ai-purple-50-main);
`;

const TitleWrapper = styled.div`
  gap: 4px;

  img.nova {
    width: 55px;
    height: 16px;
  }

  ${flexCenter};
  flex-direction: row;
`;

const ButtonWrapper = styled.div`
  gap: 8px;

  ${flexCenter};
  flex-direction: row;
`;

export interface NovaHeaderProps {
  setInputContents?: React.Dispatch<React.SetStateAction<string>>;
}

export default function NovaHeader(props: NovaHeaderProps) {
  const { t } = useTranslation();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const creditInfo = useAppSelector(creditInfoSelector);

  const CREDIT_NAME_MAP: { [category: string]: { [serviceType: string]: string } | string } = {
    [t('Nova.CreditInfo.AIChat.Title')]: {
      NOVA_CHAT_GPT4O: t(`Nova.CreditInfo.AIChat.Chat`),
      NOVA_ASK_DOC_GPT4O: t(`Nova.CreditInfo.AIChat.DocImgQuery`),
      NOVA_IMG_GPT4O: t(`Nova.CreditInfo.AIChat.ImgGen`)
    },
    NOVA_ANIMATION_3D_IMMERSITY: t(`Nova.CreditInfo.Convert2DTo3D`) || '',
    NOVA_REMOVE_BG: t(`Nova.CreditInfo.RemoveBG`) || '',
    NOVA_REPLACE_BG_CLIPDROP: t(`Nova.CreditInfo.ChangeBG`) || '',
    NOVA_REIMAGE_CLIPDROP: t(`Nova.CreditInfo.RemakeImg`) || '',
    NOVA_UNCROP_CLIPDROP: t(`Nova.CreditInfo.ExpandImg`) || '',
    NOVA_PO_RESOLUTION: t(`Nova.CreditInfo.ImprovedRes`) || '',
    NOVA_PO_STYLE_TRANSFER: t(`Nova.CreditInfo.ChangeStyle`) || ''
  };

  const filterCreditInfo = (
    creditInfo: InitialState[],
    nameMap: { [category: string]: { [serviceType: string]: string } | string }
  ) => {
    return creditInfo.filter((item) => {
      if (typeof nameMap[item.serviceType] === 'string') {
        return !!nameMap[item.serviceType];
      }

      return Object.values(nameMap).some((subMap) => {
        if (typeof subMap === 'object' && subMap[item.serviceType]) {
          return true;
        }
        return false;
      });
    });
  };

  const credit = filterCreditInfo(creditInfo, CREDIT_NAME_MAP);

  const TOOLTIP_CREDIT_OPTIONS = Object.entries(CREDIT_NAME_MAP).flatMap(
    ([category, serviceMap]) => {
      if (typeof serviceMap === 'string') {
        const creditItem = credit.find((item) => item.serviceType === category);
        return creditItem
          ? [
              {
                name: serviceMap, // 서비스 이름
                icon: { src: ico_credit, txt: String(creditItem.deductCredit) }
              }
            ]
          : [];
      }

      return Object.entries(serviceMap).flatMap(([serviceType, serviceName]) => {
        const creditItem = credit.find((item) => item.serviceType === serviceType);
        return creditItem
          ? {
              name: serviceName,
              icon: { src: ico_credit, txt: String(creditItem.deductCredit) },
              category: category
            }
          : [];
      });
    }
  );

  const newChat = async () => {
    const ret = await confirm({
      title: t(`Nova.Confirm.NewChat.Title`)!,
      msg: t(`Nova.Confirm.NewChat.Msg`),
      onCancel: {
        text: t(`Cancel`)!,
        callback: () => {}
      },
      onOk: {
        text: t(`Nova.Confirm.NewChat.Ok`),
        callback: () => {}
      },
      direction: 'row'
    });

    if (ret) {
      await chatNova.newChat();
      if (props.setInputContents) props.setInputContents('');
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
    }
  };

  return (
    <StyledHeader title="" subTitle="">
      <TitleWrapper>
        <IconLogoNova width={107} height={32} />
      </TitleWrapper>
      <ButtonWrapper>
        {novaHistory.length > 0 && selectedNovaTab === NOVA_TAB_TYPE.aiChat && (
          <IconButton
            iconComponent={IconMessagePlus}
            onClick={newChat}
            iconSize="lg"
            width={32}
            height={32}
          />
        )}
        <Tooltip
          title={t(`Nova.CreditInfo.Title`) as string}
          placement="bottom-end"
          type="normal"
          options={TOOLTIP_CREDIT_OPTIONS}>
          <Icon iconSrc={ico_credit_info} size={32} />
        </Tooltip>
        {isDesktop && (
          <>
            <ScreenChangeButton></ScreenChangeButton>
            <IconButton
              iconComponent={IconClose}
              onClick={() => {
                Bridge.callBridgeApi('closePanel', selectedNovaTab as string);
              }}
              iconSize="lg"
              width={32}
              height={32}
            />
          </>
        )}
      </ButtonWrapper>
    </StyledHeader>
  );
}

export const filterCreditInfo = (
  creditInfo: InitialState[],
  nameMap: { [category: string]: { [serviceType: string]: string } | string }
) => {
  return creditInfo.filter((item) => {
    if (nameMap[item.serviceType]) {
      return true;
    }

    return Object.values(nameMap).some((subMap) => {
      if (typeof subMap === 'object' && subMap[item.serviceType]) {
        return true;
      }
      return false;
    });
  });
};
