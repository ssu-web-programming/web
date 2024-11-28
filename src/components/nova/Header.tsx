import React from 'react';
import { ReactComponent as IconLogoNova } from 'img/ico_logo_nova.svg';
import { ReactComponent as IconMessagePlus } from 'img/ico_message_plus.svg';
import { ReactComponent as IconClose } from 'img/ico_nova_close.svg';
import { Trans, useTranslation } from 'react-i18next';
import { initFlagSelector } from 'store/slices/initFlagSlice';
import styled, { css } from 'styled-components';

import ico_credit from '../../img/ico_credit_gray.svg';
import { ReactComponent as IconCreditLine } from '../../img/ico_credit_line.svg';
import { ReactComponent as ArrowLeftIcon } from '../../img/nova/arrow_left.svg';
import { ReactComponent as IconConvert } from '../../img/nova/tab/convert_Img.svg';
import { creditInfoSelector, InitialState } from '../../store/slices/creditInfo';
import {
  deselectAllItems,
  isShareModeSelector,
  novaHistorySelector,
  selectAllItems,
  selectedItemsSelector,
  setIsShareMode
} from '../../store/slices/nova/novaHistorySlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge, { isDesktop } from '../../util/bridge';
import IconButton from '../buttons/IconButton';
import { useConfirm } from '../Confirm';
import { useChatNova } from '../hooks/useChatNova';
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

const CreditIcon = styled(IconCreditLine)<{
  $isInit: boolean;
}>`
  path {
    fill: ${({ $isInit }) => ($isInit ? '#454C53' : '#454c5380')};
  }

  circle {
    stroke: ${({ $isInit }) => ($isInit ? '#454C53' : '#454c5380')};
  }
`;

const SelectionText = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  color: var(--ai-purple-50-main);
`;

export interface NovaHeaderProps {
  setInputContents?: React.Dispatch<React.SetStateAction<string>>;
}

export default function NovaHeader(props: NovaHeaderProps) {
  const { t } = useTranslation();
  const novaHistory = useAppSelector(novaHistorySelector);
  const isShareMode = useAppSelector(isShareModeSelector);
  const selectedItems = useAppSelector(selectedItemsSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const creditInfo = useAppSelector(creditInfoSelector);
  const { isInit } = useAppSelector(initFlagSelector);

  const CREDIT_NAME_MAP: {
    [category: string]:
      | {
          [serviceType: string]: {
            text: string;
            textIcon?: any;
          };
        }
      | {
          text: string;
          textIcon?: any;
        };
  } = {
    [t('Nova.CreditInfo.AIChat.Title')]: {
      NOVA_CHAT_GPT4O: {
        text: t(`Nova.CreditInfo.AIChat.Chat`)
      },
      NOVA_ASK_DOC_GPT4O: {
        text: t(`Nova.CreditInfo.AIChat.DocImgQuery`)
      },
      NOVA_IMG_GPT4O: {
        text: t(`Nova.CreditInfo.AIChat.ImgGen`)
      }
    },
    NOVA_ANIMATION_3D_IMMERSITY: {
      text: t(`Nova.CreditInfo.Convert2DTo3D`) || '',
      textIcon: (
        <Trans
          i18nKey={`Nova.CreditInfo.Convert2DTo3D`}
          components={{
            img: <IconConvert height={11} />
          }}
        />
      )
    },
    NOVA_REMOVE_BG: {
      text: t(`Nova.CreditInfo.RemoveBG`) || ''
    },
    NOVA_REPLACE_BG_CLIPDROP: {
      text: t(`Nova.CreditInfo.ChangeBG`) || ''
    },
    NOVA_REIMAGE_CLIPDROP: {
      text: t(`Nova.CreditInfo.RemakeImg`) || ''
    },
    NOVA_UNCROP_CLIPDROP: {
      text: t(`Nova.CreditInfo.ExpandImg`) || ''
    },
    NOVA_PO_RESOLUTION: {
      text: t(`Nova.CreditInfo.ImprovedRes`) || ''
    },
    NOVA_PO_STYLE_TRANSFER: {
      text: t(`Nova.CreditInfo.ChangeStyle`) || ''
    }
  };

  const filterCreditInfo = (
    creditInfo: InitialState[],
    nameMap: {
      [category: string]:
        | {
            [serviceType: string]: {
              text: string;
            };
          }
        | {
            text: string;
          };
    }
  ) => {
    return creditInfo.filter((item) => {
      const categoryMap = nameMap[item.serviceType];

      // 단일 서비스 타입인 경우
      if (categoryMap && 'text' in categoryMap) {
        return !!categoryMap.text;
      }

      // 서브 서비스 타입이 있는 경우
      return Object.entries(nameMap).some(([_, value]) => {
        if (typeof value === 'object' && !('text' in value)) {
          return !!value[item.serviceType]?.text;
        }
        return false;
      });
    });
  };

  const credit = filterCreditInfo(creditInfo, CREDIT_NAME_MAP);

  const TOOLTIP_CREDIT_OPTIONS = Object.entries(CREDIT_NAME_MAP).flatMap(
    ([category, serviceMap]) => {
      // 단일 서비스인 경우 (text 프로퍼티가 있는 경우)
      if ('text' in serviceMap) {
        const creditItem = credit.find((item) => item.serviceType === category);
        return creditItem
          ? [
              {
                name: serviceMap.text,
                nameWithIcon: serviceMap.textIcon,
                icon: { src: ico_credit, txt: String(creditItem.deductCredit) }
              }
            ]
          : [];
      }

      // 서브 서비스가 있는 경우
      return Object.entries(serviceMap).flatMap(([serviceType, service]) => {
        const creditItem = credit.find((item) => item.serviceType === serviceType);
        return creditItem
          ? {
              name: service.text,
              nameWithIcon: serviceMap.textIcon,
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

  const handleChangeSelection = () => {
    if (selectedItems.length > 0) {
      dispatch(deselectAllItems());
    } else {
      dispatch(selectAllItems());
    }
  };

  return (
    <StyledHeader title="" subTitle="">
      {isShareMode ? (
        <>
          <ArrowLeftIcon width={32} height={32} onClick={() => dispatch(setIsShareMode(false))} />
          <SelectionText onClick={handleChangeSelection}>
            {selectedItems.length > 0 ? '선택 해제' : '모두 선택'}
          </SelectionText>
        </>
      ) : (
        <>
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
              <CreditIcon $isInit={isInit} />
            </Tooltip>
            <ScreenChangeButton></ScreenChangeButton>
            {isDesktop && (
              <IconButton
                iconComponent={IconClose}
                onClick={() => {
                  Bridge.callBridgeApi('closePanel', selectedNovaTab as string);
                }}
                iconSize="lg"
                width={32}
                height={32}
              />
            )}
          </ButtonWrapper>
        </>
      )}
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
