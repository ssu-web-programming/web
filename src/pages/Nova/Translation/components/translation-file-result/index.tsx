import IconTextButton from 'components/buttons/IconTextButton';
import { ReactComponent as CheckLightIcon } from 'img/light/nova/check_purple.svg';
import compareViewerIcon from 'img/light/nova/translation/book.svg';
import downloadIcon from 'img/light/nova/translation/download.svg';
import { activeLoadingSpinner } from 'store/slices/loadingSpinner';
import { useAppDispatch } from 'store/store';
import { css } from 'styled-components';
import Bridge, { ClientType, getPlatform } from 'util/bridge';

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
      originFile,
      translationFileName,
      translationFileUrl
    });
  };

  const handleDownloadFile = async () => {
    dispatch(activeLoadingSpinner());

    await Bridge.callBridgeApi<DownloadFileArgs>('downloadFile', {
      fileName: translationFileName,
      url: translationFileUrl
    });
  };

  return (
    <S.Container>
      <S.Title>
        <CheckLightIcon />
        <span>파일 번역 완료</span>
      </S.Title>
      <S.SubTitle>
        <p>원하는 언어로 번역이 완료되었어요!</p>
        <p>저장하고 바로 번역된 내용을 확인해보세요!</p>
      </S.SubTitle>
      <S.FileItemWrapper>
        <FileItem fileName={translationFileName} />
      </S.FileItemWrapper>
      <S.ButtonGroup>
        {(getPlatform() === ClientType.windows || getPlatform() === ClientType.mac) && (
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
            원본-번역 비교 보기
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
          저장
        </IconTextButton>
      </S.ButtonGroup>
    </S.Container>
  );
}
