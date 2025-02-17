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
import {
  getChatGroupKey,
  getServiceCategoryFromTab,
  getServiceGroupInfo,
  SERVICE_TYPE
} from '../../../constants/serviceType';
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
import CreditInfo from '../creditInfo';
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
  const { creating, selectedNovaTab } = useAppSelector(selectTabSlice);
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const { isExternal } = useAppSelector(appStateSelector);
  const chatMode = useAppSelector(novaChatModeSelector);
  const { handleClearPastedImages } = useClipboard();

  const {
    resetVoiceInfo,
    sharedVoiceDictationInfo: { isVoiceRecording }
  } = useVoiceDictationContext();

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
    const category = getServiceCategoryFromTab(tab);
    if (tab === 'convert2DTo3D') {
      return (
        <Trans
          i18nKey={`Nova.Home.${category?.toLowerCase()}.${tab}`}
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

    return t(`Nova.Home.${category?.toLowerCase()}.${tab}`);
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
              <S.Logo onClick={handleGoHome} />
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
              </>
            )}
            {(selectedNovaTab === NOVA_TAB_TYPE.aiChat ||
              selectedNovaTab === NOVA_TAB_TYPE.perplexity) && (
              <ChatMode>
                <span>
                  {chatMode === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
                    ? 'Perplexity R-Pro'
                    : getServiceGroupInfo(getChatGroupKey(chatMode) || '', isLightMode).label}
                </span>
              </ChatMode>
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
            <CreditInfo />
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
