import IconTextButton from 'components/buttons/IconTextButton';
import { ReactComponent as CheckLightIcon } from 'img/light/nova/check_purple.svg';
import compareViewerIcon from 'img/light/nova/translation/book.svg';
import downloadIcon from 'img/light/nova/translation/download.svg';
import { useTranslation } from 'react-i18next';
import { activeLoadingSpinner } from 'store/slices/loadingSpinner';
import { useAppDispatch, useAppSelector } from 'store/store';
import { css } from 'styled-components';
import Bridge, { ClientType, fileToString, getPlatform } from 'util/bridge';
import { getCurrentDateFormatted } from 'util/getAudioDuration';

import { platformInfoSelector } from '../../../../../store/slices/platformInfo';
import { useTranslationContext } from '../../provider/translation-provider';
import FileItem from '../file-item';

import * as S from './style';

interface CompareSouceAndTranslationArgs {
  originalFileType: 'currentDoc' | 'drive' | 'local';
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

  const handleCompareSourceAndTranslation = async () => {
    dispatch(activeLoadingSpinner());
    await Bridge.callBridgeApi<CompareSouceAndTranslationArgs>('compareSourceAndTranslation', {
      originalFileType,
      originalFileName,
      originFile: originalFileType === 'local' ? await fileToString(originFile) : originFile,
      translationFileName,
      translationFileUrl
    });
  };

  const handleDownloadFile = async () => {
    dispatch(activeLoadingSpinner());

    console.log('translationFileName', translationFileName);
    await Bridge.callBridgeApi<DownloadFileArgs>('downloadFile', {
      fileName: translationFileName + getCurrentDateFormatted(),
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
        <FileItem fileName={translationFileName} />
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
            원본-번역 비교보기
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
