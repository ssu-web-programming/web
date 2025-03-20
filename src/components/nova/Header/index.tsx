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
import { useNavigate } from 'react-router-dom';
import { clearError, errorSelector } from 'store/slices/errorSlice';

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
  selectPageCreditReceived,
  selectPageService,
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
import UseShowSurveyModal from '../../hooks/use-survey-modal';
import { useChatNova } from '../../hooks/useChatNova';
import CreditInfo from '../creditInfo';
import { ScreenChangeButton } from '../ScreenChangeButton';

import * as S from './style';

export interface NovaHeaderProps {
  setInputContents?: React.Dispatch<React.SetStateAction<string>>;
}

export default function NovaHeader(props: NovaHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLightMode, curTheme } = useAppSelector(themeInfoSelector);
  const novaHistory = useAppSelector(novaHistorySelector);
  const isShareMode = useAppSelector(isShareModeSelector);
  const { creating, selectedNovaTab } = useAppSelector(selectTabSlice);
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(selectedNovaTab));
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const { isExternal } = useAppSelector(appStateSelector);
  const chatMode = useAppSelector(novaChatModeSelector);
  const { handleClearPastedImages } = useClipboard();
  const { isError } = useAppSelector(errorSelector);
  const showSurveyModal = UseShowSurveyModal();

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

  const isVoiceAndTranslationDisabledBack =
    (componentType === 'LOADING' && voiceDictationResult === null) ||
    translationComponentType === 'LOADING';

  const newChat = async (isBack = false) => {
    if (creating === 'NOVA') return;

    const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
    if (isShowModal) return;

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
      await chatNova.newChat(selectedNovaTab, novaHistory);
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
            onConfirm={() => {
              resetVoiceInfo();
              close(true);
            }}
            title={
              isReadyStatus
                ? t('Nova.voiceDictation.Alert.UnsavedGoBack')
                : t('Nova.voiceDictation.Alert.UnsavedRecording')
            }
            confirmTxt={
              isReadyStatus ? (t('Back') as string) : (t('Nova.Confirm.CloseAIVideo.Ok') as string)
            }
            closeTxt={t('Cancel') as string}
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
    if (props.setInputContents) props.setInputContents('');
    Bridge.callBridgeApi('curNovaTab', NOVA_TAB_TYPE.home);
  };

  const handleGoHome = async () => {
    const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
    if (isShowModal) return;

    if (isError && selectedNovaTab === NOVA_TAB_TYPE.voiceDictation) {
      await resetPage();
      resetVoiceInfo();
      return;
    }
    if (isError && selectedNovaTab === NOVA_TAB_TYPE.translation) {
      await resetPage();
      resetTranslation();
      return;
    }

    if (isDisableBack) {
      if (selectedNovaTab === NOVA_TAB_TYPE.aiVideo) {
        if (['avatar', 'voice', 'script'].includes(status)) {
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
      } else {
        const isClosedModalCondition =
          isVoiceRecording || componentType === 'VOICE_READY' || componentType === 'FILE_READY';

        if (isVoiceAndTranslationDisabledBack) {
          return;
        }
        // 녹음중 상태이면 아래 팝업을 열어여한다.

        if (isClosedModalCondition && selectedNovaTab === NOVA_TAB_TYPE.voiceDictation) {
          await openClosedModal();
          return;
        }
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

  const getBackButtonIcon = () => {
    if (isError) {
      return isLightMode ? ArrowLeftLightIcon : ArrowLeftDarkIcon;
    }

    if (isVoiceAndTranslationDisabledBack) {
      return ArrowLeftDisableIcon;
    }

    if (isDisableBack) {
      return isLightMode ? ArrowLeftLightIcon : ArrowLeftDarkIcon;
    }

    return ArrowLeftDisableIcon;
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
                  src={getBackButtonIcon()}
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
            <ScreenChangeButton />
            {isDesktop && (
              <IconButton
                iconComponent={isLightMode ? CloseLightIcon : CloseDarkIcon}
                onClick={async () => {
                  const isShowModal = await showSurveyModal(
                    selectedNovaTab,
                    service,
                    isCreditRecieved
                  );
                  if (isShowModal) return;

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
