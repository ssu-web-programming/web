import React from 'react';
import { ReactComponent as MessagePlusDarkIcon } from 'img/dark/ico_message_plus.svg';
import { ReactComponent as CloseDarkIcon } from 'img/dark/ico_nova_close.svg';
import { ReactComponent as MessagePlusLightIcon } from 'img/light/ico_message_plus.svg';
import { ReactComponent as CloseLightIcon } from 'img/light/ico_nova_close.svg';
import { Trans, useTranslation } from 'react-i18next';
import { initFlagSelector } from 'store/slices/initFlagSlice';
import styled, { css } from 'styled-components';

import ArrowLeftDarkIcon from '../../img/dark/ico_arrow_left.svg';
import { ReactComponent as IconConvertDark } from '../../img/dark/nova/tab/convert_Img.svg';
import ArrowLeftLightIcon from '../../img/light/ico_arrow_left.svg';
import ico_credit from '../../img/light/ico_credit_gray.svg';
import { ReactComponent as CreditLineIcon } from '../../img/light/ico_credit_line.svg';
import { ReactComponent as IconConvertLight } from '../../img/light/nova/tab/convert_Img.svg';
import { creditInfoSelector, InitialState } from '../../store/slices/creditInfo';
import {
  isShareModeSelector,
  novaHistorySelector,
  setIsShareMode
} from '../../store/slices/nova/novaHistorySlice';
import {
  selectPageStatus,
  setPageData,
  setPageResult,
  setPageStatus
} from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { themeInfoSelector } from '../../store/slices/theme';
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
`;

const TitleWrapper = styled.div`
  ${flexCenter};
  flex-direction: row;
  gap: 4px;
  color: ${({ theme }) => theme.color.text.subGray04};
`;

const Logo = styled.img`
  content: url(${({ theme }) => theme.img.logo});
`;

const ButtonWrapper = styled.div`
  height: 32px;
  gap: 8px;

  ${flexCenter};
  flex-direction: row;
`;

const CreditIcon = styled(CreditLineIcon)<{
  $isInit: boolean;
}>`
  path {
    fill: ${({ $isInit, theme }) =>
      $isInit
        ? theme.mode === 'light'
          ? 'var(--gray-gray-80-02)'
          : 'var(--gray-gray-25)'
        : '#454c5380'};
  }

  circle {
    stroke: ${({ $isInit, theme }) =>
      $isInit
        ? theme.mode === 'light'
          ? 'var(--gray-gray-80-02)'
          : 'var(--gray-gray-25)'
        : '#454c5380'};
  }
`;

const SelectionText = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  color: var(--ai-purple-50-main);
`;

const StyledIconConvertLight = styled(IconConvertLight)`
  path {
    fill: black;
  }
`;

const StyledIconConvertDark = styled(IconConvertDark)`
  path {
    fill: var(--gray-gray-25);
  }
`;

export interface NovaHeaderProps {
  setInputContents?: React.Dispatch<React.SetStateAction<string>>;
}

export default function NovaHeader(props: NovaHeaderProps) {
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const novaHistory = useAppSelector(novaHistorySelector);
  const isShareMode = useAppSelector(isShareModeSelector);
  const { usingAI, selectedNovaTab } = useAppSelector(selectTabSlice);
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
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
            img: isLightMode ? <IconConvertLight height={11} /> : <IconConvertDark height={11} />
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

  const newChat = async (isBack = false) => {
    const ret = await confirm({
      title: isBack ? undefined : t(`Nova.Confirm.NewChat.Title`)!,
      msg: isBack ? t(`Nova.Confirm.ResetChat.Msg`) : t(`Nova.Confirm.NewChat.Msg`),
      onCancel: {
        text: t(`Cancel`)!,
        callback: () => {}
      },
      onOk: {
        text: isBack ? t(`Nova.Confirm.ResetChat.Ok`) : t(`Nova.Confirm.NewChat.Ok`),
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

  const getTabTranslationKey = (tab: NOVA_TAB_TYPE) => {
    if (tab === 'convert2DTo3D') {
      return (
        <Trans
          i18nKey={`Nova.Tabs.${tab}`}
          components={{
            img: isLightMode ? (
              <StyledIconConvertLight height={11} />
            ) : (
              <StyledIconConvertDark height={11} />
            )
          }}
        />
      );
    }

    return t(`Nova.Tabs.${tab}`);
  };

  const handleGoBack = async () => {
    if (selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
      await newChat(true);
    } else {
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
      dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
      dispatch(setPageData({ tab: selectedNovaTab, data: null }));
      dispatch(setPageResult({ tab: selectedNovaTab, result: null }));
    }
  };

  return (
    <StyledHeader title="" subTitle="">
      {isShareMode ? (
        <>
          <span>{t(`Nova.aiChat.Share`)}</span>
          <IconButton
            iconComponent={isLightMode ? CloseLightIcon : CloseDarkIcon}
            onClick={() => dispatch(setIsShareMode(false))}
            iconSize="lg"
            width={32}
            height={32}
          />
        </>
      ) : (
        <>
          <TitleWrapper>
            {(status === 'home' || status === 'progress') &&
            (selectedNovaTab !== NOVA_TAB_TYPE.aiChat || !usingAI) ? (
              <Logo />
            ) : (
              <>
                <img
                  src={isLightMode ? ArrowLeftLightIcon : ArrowLeftDarkIcon}
                  alt="arrow-left"
                  onClick={handleGoBack}
                  style={{
                    cursor: 'pointer'
                  }}
                />
                <span>{getTabTranslationKey(selectedNovaTab)}</span>
              </>
            )}
          </TitleWrapper>
          <ButtonWrapper>
            {novaHistory.length > 0 && selectedNovaTab === NOVA_TAB_TYPE.aiChat && (
              <IconButton
                iconComponent={isLightMode ? MessagePlusLightIcon : MessagePlusDarkIcon}
                onClick={() => newChat()}
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
                iconComponent={isLightMode ? CloseLightIcon : CloseDarkIcon}
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
