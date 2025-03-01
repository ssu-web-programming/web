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
import useErrorHandle from '../../../../../components/hooks/useErrorHandle';
import SurveyModalContent from '../../../../../components/nova/satisfactionSurvey/survey-modal-content';
import OverlayModal from '../../../../../components/overlay-modal';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { SERVICE_TYPE } from '../../../../../constants/serviceType';
import { selectPageCreditReceived } from '../../../../../store/slices/nova/pageStatusSlice';
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
  const errorHandle = useErrorHandle();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(NOVA_TAB_TYPE.translation));

  const {
    sharedTranslationInfo: {
      originFile,
      originalFileName,
      originalFileType,
      translationFileName,
      translationFileUrl
    }
  } = useTranslationContext();

  const handleCompareSourceAndTranslation = async () => {
    dispatch(activeLoadingSpinner());
    console.log('비교 분석하기 log', {
      originalFileType,
      originFile
    });
    await Bridge.callBridgeApi<CompareSouceAndTranslationArgs>('compareSourceAndTranslation', {
      originalFileType,
      originalFileName,
      originFile,
      translationFileName,
      translationFileUrl
    });
  };

  const handleDownloadFile = async () => {
    dispatch(activeLoadingSpinner());
    const extractFileType = translationFileName.slice(translationFileName.lastIndexOf('.'));
    const sanitizedFileName =
      translationFileName.split(extractFileType)[0] + getCurrentDateFormatted() + extractFileType;

    await Bridge.callBridgeApi<DownloadFileArgs>('downloadFile', {
      fileName: sanitizedFileName,
      url: translationFileUrl
    });
  };

  useEffect(() => {
    // showSurveyModal();
  }, []);

  const showSurveyModal = async () => {
    // 만족도 이벤트
    if (!isCreditRecieved && !getCookie(`dontShowSurvey${selectedNovaTab}`)) {
      try {
        const { res } = await apiWrapper().request(NOVA_GET_CREDIT_USE_COUNT, {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            serviceTypes: [
              SERVICE_TYPE.NOVA_TRANSLATION_DEEPL,
              SERVICE_TYPE.NOVA_TRANSLATION_DEEPL_FILE
            ],
            startTime: '1740182400000',
            endTime: '1740528000000'
          }),
          method: 'POST'
        });

        const { data } = await res.json();
        if (data.creditUsecount >= 1) {
          overlay.closeAll();

          overlay.open(({ isOpen, close }) => {
            return (
              <OverlayModal isOpen={isOpen} onClose={close}>
                <SurveyModalContent />
              </OverlayModal>
            );
          });
        }
      } catch (error) {
        errorHandle(error);
      }
    }
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
