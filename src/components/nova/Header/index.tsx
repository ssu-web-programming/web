import React from 'react';
import OverlayModal from 'components/overlay-modal';
import { ReactComponent as MessagePlusDisabledIcon } from 'img/common/ico_message_plus.svg';
import { ReactComponent as MessagePlusDarkIcon } from 'img/dark/ico_message_plus.svg';
import { ReactComponent as CloseDarkIcon } from 'img/dark/ico_nova_close.svg';
import { ReactComponent as MessagePlusLightIcon } from 'img/light/ico_message_plus.svg';
import { ReactComponent as CloseLightIcon } from 'img/light/ico_nova_close.svg';
import { overlay } from 'overlay-kit';
import { useTranslationContext } from 'pages/Nova/Translation/provider/translation-provider';
import ClosedModalContent from 'pages/Nova/VoiceDictation/components/modals/closed-modal-content';
import { useVoiceDictationContext } from 'pages/Nova/VoiceDictation/provider/voice-dictation-provider';
import { Trans, useTranslation } from 'react-i18next';
import { clearError } from 'store/slices/errorSlice';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import {
  getChatGroupKey,
  getServiceCategoryFromTab,
  getServiceGroupInfo,
  SERVICE_TYPE
} from '../../../constants/serviceType';
import ArrowLeftDisableIcon from '../../../img/common/ico_arrow_left_disabled.svg';
import ArrowLeftDarkIcon from '../../../img/dark/ico_arrow_left.svg';
import ArrowLeftLightIcon from '../../../img/light/ico_arrow_left.svg';
import { appStateSelector } from '../../../store/slices/appState';
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
import CreditInfo from '../creditInfo';
import { ScreenChangeButton } from '../ScreenChangeButton';

import * as S from './style';

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
    sharedVoiceDictationInfo: { isVoiceRecording, componentType, voiceDictationResult }
  } = useVoiceDictationContext();
  const {
    sharedTranslationInfo: { componentType: translationComponentType },
    resetTranslation
  } = useTranslationContext();

  const isDisableBack =
    status !== 'progress' && status !== 'saving' && status !== 'loading' && creating != 'NOVA';

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
    const isReadyStatus = componentType === 'VOICE_READY' || componentType === 'FILE_READY';
    const result = await overlay.openAsync(({ isOpen, close }) => {
      return (
        <OverlayModal isOpen={isOpen} onClose={() => close(false)}>
          <ClosedModalContent
            onConfirm={() => close(true)}
            title={
              isReadyStatus
                ? '잠깐! 뒤로가면 녹음이 저장되지 않아요. 그래도 뒤로가시겠어요?'
                : '잠깐! 녹음을 끝내지 않고 이동하면 녹음이 저장되지 않아요. 그래도 뒤로가시겠어요?'
            }
            confirmTxt={isReadyStatus ? '뒤로가기' : '이동하기'}
          />
        </OverlayModal>
      );
    });

    return result;
  };

  const resetPage = async () => {
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
    dispatch(setPageData({ tab: selectedNovaTab, data: null }));
    dispatch(setPageResult({ tab: selectedNovaTab, result: null }));
    dispatch(selectNovaTab(NOVA_TAB_TYPE.home));
    dispatch(clearError());
    Bridge.callBridgeApi('curNovaTab', NOVA_TAB_TYPE.home);
  };

  const handleGoHome = async () => {
    if (status === 'progress' && selectedNovaTab === NOVA_TAB_TYPE.aiVideo) {
      await resetPage();
    }

    if (isDisableBack) {
      if (selectedNovaTab === NOVA_TAB_TYPE.voiceDictation) {
        const isClosedModalCondition =
          isVoiceRecording || componentType === 'VOICE_READY' || componentType === 'FILE_READY';
        // 녹음중 상태이면 아래 팝업을 열어여한다.
        if (
          (componentType === 'LOADING' && voiceDictationResult === null) ||
          translationComponentType === 'LOADING'
        ) {
          return;
        }

        if (isClosedModalCondition) {
          const result = await openClosedModal();
          if (!result) return;
        }
      } else if (selectedNovaTab === NOVA_TAB_TYPE.aiVideo) {
        const ret = await confirm({
          title: '',
          msg: t(`Nova.Confirm.CloseAIVideo.Msg`),
          onOk: {
            text: t('Nova.Confirm.CloseAIVideo.Ok'),
            callback: () => {}
          },
          onCancel: {
            text: t('Cancel'),
            callback: () => {}
          }
        });
        if (!ret) return;
      }

      await resetPage();
      if (
        translationComponentType === 'FILE_RESULT' ||
        translationComponentType === 'TEXT_RESULT'
      ) {
        resetTranslation();
      }

      if (componentType === 'RESULT') {
        resetVoiceInfo();
      }
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
                    isDisableBack ||
                    (status === 'progress' && selectedNovaTab === NOVA_TAB_TYPE.aiVideo)
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
              <S.ChatMode>
                <span>
                  {chatMode === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
                    ? 'Perplexity R-Pro'
                    : getServiceGroupInfo(getChatGroupKey(chatMode) || '', isLightMode).label}
                </span>
              </S.ChatMode>
            )}
          </S.TitleWrapper>
          <S.ButtonWrapper>
            {/*다크 모드 개발 편의를 위한 버튼*/}
            {process.env.NODE_ENV == 'development' && (
              <button
                onClick={() => {
                  const theme = curTheme === ThemeType.light ? ThemeType.dark : ThemeType.light;
                  dispatch(setThemeInfo(theme));
                }}>
                theme
              </button>
            )}
            {novaHistory.length > 0 &&
              (selectedNovaTab === NOVA_TAB_TYPE.aiChat ||
                selectedNovaTab === NOVA_TAB_TYPE.perplexity) && (
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
