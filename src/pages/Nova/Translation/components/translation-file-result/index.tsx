import { useEffect } from 'react';
import IconTextButton from 'components/buttons/IconTextButton';
import { ReactComponent as CheckLightIcon } from 'img/light/nova/check_purple.svg';
import compareViewerIcon from 'img/light/nova/translation/book.svg';
import downloadIcon from 'img/light/nova/translation/download.svg';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';
import { activeLoadingSpinner } from 'store/slices/loadingSpinner';
import { useAppDispatch, useAppSelector } from 'store/store';
import { css } from 'styled-components';
import Bridge, { ClientType } from 'util/bridge';
import { getCurrentDateFormatted } from 'util/getAudioDuration';

import { apiWrapper } from '../../../../../api/apiWrapper';
import { NOVA_GET_CREDIT_USE_COUNT } from '../../../../../api/constant';
import UseShowSurveyModal from '../../../../../components/hooks/use-survey-modal';
import useErrorHandle from '../../../../../components/hooks/useErrorHandle';
import SurveyModalContent from '../../../../../components/nova/satisfactionSurvey/survey-modal-content';
import OverlayModal from '../../../../../components/overlay-modal';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { SERVICE_TYPE } from '../../../../../constants/serviceType';
import {
  selectPageCreditReceived,
  selectPageService
} from '../../../../../store/slices/nova/pageStatusSlice';
import { platformInfoSelector } from '../../../../../store/slices/platformInfo';
import { selectTabSlice } from '../../../../../store/slices/tabSlice';
import { getCookie } from '../../../../../util/common';
import { useTranslationContext } from '../../provider/translation-provider';
import FileItem from '../file-item';

import * as S from './style';

interface CompareSouceAndTranslationArgs {
  originalFileType: 'currentDoc' | 'drive';
  originalFileName: string;
  originFile: any;
  translationFileName: string;
  translationFileUrl: string;
}

interface DownloadFileArgs {
  fileName: string;
  url: string;
}

export default function TranslationFileResult() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { platform } = useAppSelector(platformInfoSelector);
  const {
    sharedTranslationInfo: {
      originFile,
      originalFileName,
      originalFileType,
      translationFileName,
      translationFileUrl
    }
  } = useTranslationContext();

  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(selectedNovaTab));
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const showSurveyModal = UseShowSurveyModal();

  const handleCompareSourceAndTranslation = async () => {
    const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
    if (isShowModal) return;

    dispatch(activeLoadingSpinner());
    await Bridge.callBridgeApi<CompareSouceAndTranslationArgs>('compareSourceAndTranslation', {
      originalFileType,
      originalFileName,
      originFile,
      translationFileName,
      translationFileUrl
    });
  };

  const handleDownloadFile = async () => {
    const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
    if (isShowModal) return;

    dispatch(activeLoadingSpinner());
    const extractFileType = translationFileName.slice(translationFileName.lastIndexOf('.'));
    const sanitizedFileName =
      translationFileName.split(extractFileType)[0] + getCurrentDateFormatted() + extractFileType;

    await Bridge.callBridgeApi<DownloadFileArgs>('downloadFile', {
      fileName: sanitizedFileName,
      url: translationFileUrl
    });
  };

  return (
    <S.Container>
      <S.Title>
        <CheckLightIcon />
        <span>{t('Nova.translation.Status.FileTranslated')}</span>
      </S.Title>
      <S.SubTitle>
        <p>{t('Nova.translation.Status.TranslationCompleted')}</p>
        <p>{t('Nova.translation.Status.SaveAndCheck')}</p>
      </S.SubTitle>
      <S.FileItemWrapper>
        <FileItem fileName={translationFileName} isDeleteIcon={false} />
      </S.FileItemWrapper>
      <S.ButtonGroup>
        {(platform === ClientType.windows || platform === ClientType.mac) && (
          <IconTextButton
            width={'full'}
            height={48}
            borderType="gray"
            onClick={handleCompareSourceAndTranslation}
            iconSrc={compareViewerIcon}
            iconPos={'left'}
            iconSize={24}
            cssExt={css`
              border-radius: 8px;
              font-size: 15px;
            `}>
            {t('Nova.translation.Button.CompareAndTranslation')}
          </IconTextButton>
        )}

        <IconTextButton
          width={'full'}
          height={48}
          onClick={handleDownloadFile}
          iconSrc={downloadIcon}
          iconPos={'left'}
          iconSize={24}
          cssExt={css`
            border-radius: 8px;
            font-size: 15px;
            margin-top: 8px;
            background: #6f3ad0;
            color: #fff;
          `}>
          {t('Nova.translation.Button.SaveNow')}
        </IconTextButton>
      </S.ButtonGroup>
    </S.Container>
  );
}
