import React from 'react';
import OverlayModal from 'components/overlay-modal';
import { ReactComponent as MessagePlusDisabledIcon } from 'img/common/ico_message_plus.svg';
import { ReactComponent as MessagePlusDarkIcon } from 'img/dark/ico_message_plus.svg';
import { ReactComponent as CloseDarkIcon } from 'img/dark/ico_nova_close.svg';
import { ReactComponent as MessagePlusLightIcon } from 'img/light/ico_message_plus.svg';
import { ReactComponent as CloseLightIcon } from 'img/light/ico_nova_close.svg';
import { overlay } from 'overlay-kit';
import ClosedModalContent from 'pages/Nova/VoiceDictation/components/modals/closed-modal-content';
import { useVoiceDictationContext } from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import { Trans, useTranslation } from 'react-i18next';
import { initFlagSelector } from 'store/slices/initFlagSlice';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import ArrowLeftDisableIcon from '../../../img/common/ico_arrow_left_disabled.svg';
import ArrowLeftDarkIcon from '../../../img/dark/ico_arrow_left.svg';
import { ReactComponent as IconConvertDark } from '../../../img/dark/nova/tab/convert_Img.svg';
import ArrowLeftLightIcon from '../../../img/light/ico_arrow_left.svg';
import ico_credit from '../../../img/light/ico_credit_gray.svg';
import { ReactComponent as IconConvertLight } from '../../../img/light/nova/tab/convert_Img.svg';
import { appStateSelector } from '../../../store/slices/appState';
import { creditInfoSelector, InitialState } from '../../../store/slices/creditInfo';
import {
  isShareModeSelector,
  novaChatModeSelector,
  novaHistorySelector,
  setIsShareMode
} from '../../../store/slices/nova/novaHistorySlice';
import {
  selectPageStatus,
  setPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { selectNovaTab, selectTabSlice } from '../../../store/slices/tabSlice';
import { setThemeInfo, themeInfoSelector, ThemeType } from '../../../store/slices/theme';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import Bridge, { isDesktop } from '../../../util/bridge';
import IconButton from '../../buttons/IconButton';
import { useConfirm } from '../../Confirm';
import useClipboard from '../../hooks/nova/use-clipboard';
import { useChatNova } from '../../hooks/useChatNova';
import Tooltip from '../../Tooltip';
import { ScreenChangeButton } from '../ScreenChangeButton';

import * as S from './style';
import { ChatMode } from './style';

export interface NovaHeaderProps {
  setInputContents?: React.Dispatch<React.SetStateAction<string>>;
}

export default function NovaHeader(props: NovaHeaderProps) {
  const { t } = useTranslation();
  const { isLightMode, curTheme } = useAppSelector(themeInfoSelector);
  const novaHistory = useAppSelector(novaHistorySelector);
  const isShareMode = useAppSelector(isShareModeSelector);
  const { creating, usingAI, selectedNovaTab } = useAppSelector(selectTabSlice);
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const creditInfo = useAppSelector(creditInfoSelector);
  const { isInit } = useAppSelector(initFlagSelector);
  const { isExternal } = useAppSelector(appStateSelector);
  const chatMode = useAppSelector(novaChatModeSelector);
  const { handleClearPastedImages } = useClipboard();

  const {
    resetVoiceInfo,
    sharedVoiceDictationInfo: { isVoiceRecording }
  } = useVoiceDictationContext();

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
    [t('Index.CreditInfo.Index.Title')]: {
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
    if (creating === 'NOVA') return;

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
      handleClearPastedImages();
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
              <S.StyledIconConvertLight height={11} />
            ) : (
              <S.StyledIconConvertDark height={11} />
            )
          }}
        />
      );
    }

    return t(`Nova.Tabs.${tab}`);
  };
  const openClosedModal = async () => {
    const result = await overlay.openAsync(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={() => close(false)}>
          <ClosedModalContent onConfirm={() => close(true)} />
        </OverlayModal>
      );
    });

    console.log('녹음 종료여부 - result', result);
    return result;
  };

  const resetPage = async () => {
    if (selectedNovaTab === NOVA_TAB_TYPE.aiChat && novaHistory.length > 0) {
      await newChat(true);
    }

    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
    dispatch(setPageData({ tab: selectedNovaTab, data: null }));
    dispatch(setPageResult({ tab: selectedNovaTab, result: null }));
    dispatch(selectNovaTab(NOVA_TAB_TYPE.home));
    resetVoiceInfo();
    Bridge.callBridgeApi('curNovaTab', NOVA_TAB_TYPE.home);
  };

  const handleGoHome = async () => {
    if (
      status !== 'progress' &&
      status !== 'saving' &&
      status !== 'loading' &&
      creating != 'NOVA'
    ) {
      // 녹음중 상태이면 아래 팝업을 열어여한다.
      if (isVoiceRecording) {
        const result = await openClosedModal();
        if (!result) return;
      }

      await resetPage();
    }
  };

  return (
    <S.StyledHeader title="" subTitle="">
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
          <S.TitleWrapper>
            {selectedNovaTab === NOVA_TAB_TYPE.home || isExternal ? (
              <>
                <S.Logo onClick={handleGoHome} />
                {(selectedNovaTab === NOVA_TAB_TYPE.aiChat ||
                  selectedNovaTab === NOVA_TAB_TYPE.perplexity) && (
                  <ChatMode>
                    <span>{chatMode}</span>
                  </ChatMode>
                )}
              </>
            ) : (
              <>
                <img
                  src={
                    status !== 'progress' &&
                    status !== 'saving' &&
                    status !== 'loading' &&
                    creating != 'NOVA'
                      ? isLightMode
                        ? ArrowLeftLightIcon
                        : ArrowLeftDarkIcon
                      : ArrowLeftDisableIcon
                  }
                  alt="arrow-left"
                  onClick={handleGoHome}
                  style={{
                    cursor: 'pointer'
                  }}
                />
                <span>{getTabTranslationKey(selectedNovaTab)}</span>
                {(selectedNovaTab === NOVA_TAB_TYPE.aiChat ||
                  selectedNovaTab === NOVA_TAB_TYPE.perplexity) && (
                  <ChatMode>
                    <span>{chatMode}</span>
                  </ChatMode>
                )}
              </>
            )}
          </S.TitleWrapper>
          <S.ButtonWrapper>
            <button
              onClick={() => {
                const theme = curTheme === ThemeType.light ? ThemeType.dark : ThemeType.light;
                dispatch(setThemeInfo(theme));
              }}>
              theme
            </button>
            {novaHistory.length > 0 && selectedNovaTab === NOVA_TAB_TYPE.aiChat && (
              <IconButton
                iconComponent={
                  creating != 'NOVA'
                    ? isLightMode
                      ? MessagePlusLightIcon
                      : MessagePlusDarkIcon
                    : MessagePlusDisabledIcon
                }
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
              options={TOOLTIP_CREDIT_OPTIONS}
              style={{ maxHeight: `${window.innerHeight - 56}px`, overflowY: 'auto' }}>
              <S.CreditIcon $isInit={isInit} />
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
          </S.ButtonWrapper>
        </>
      )}
    </S.StyledHeader>
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
