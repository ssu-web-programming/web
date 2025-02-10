import IconTextButton from 'components/buttons/IconTextButton';
import { ReactComponent as CheckLightIcon } from 'img/light/nova/check_purple.svg';
import compareViewerIcon from 'img/light/nova/translation/book.svg';
import downloadIcon from 'img/light/nova/translation/download.svg';
import { activeLoadingSpinner } from 'store/slices/loadingSpinner';
import { selectPageData } from 'store/slices/nova/pageStatusSlice';
import { getDriveFiles, getLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';
import { css } from 'styled-components';
import Bridge, { ClientType, getPlatform } from 'util/bridge';

import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
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
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.voiceDictation));
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);

  const {
    sharedTranslationInfo: {
      originFile,
      originalFileName,
      originalFileType,
      translationFileName,
      translationFileUrl
    }
  } = useTranslationContext();

  console.log('currentFile', currentFile);
  console.log('localFiles', localFiles);
  console.log('driveFiles', driveFiles);

  // 호진FIXME: 만들어진 url로 다운로드가 가능하게만 변경하기 ( 원본-번역 비교보기 )
  const handleCompareSourceAndTranslation = async () => {
    dispatch(activeLoadingSpinner());

    await Bridge.callBridgeApi<CompareSouceAndTranslationArgs>('compareSourceAndTranslation', {
      originalFileType,
      originalFileName,
      originFile,
      translationFileName: translationFileName || '임의로 저장된 파일 이름',
      translationFileUrl:
        translationFileUrl ||
        'https://vf-berlin.polarisoffice.com/nova/storage/translate/0d80c4d8-2584-4675-bae6-7888598b932b/template.docx'
    });
  };

  // 호진FIXME: 만들어진 url로 다운로드가 가능하게만 변경하기 ( 저장하기 )
  const handleDownloadFile = async () => {
    dispatch(activeLoadingSpinner());

    await Bridge.callBridgeApi<DownloadFileArgs>('downloadFile', {
      fileName: translationFileName || '임의로 저장된 파일 이름',
      url:
        translationFileUrl ||
        'https://vf-berlin.polarisoffice.com/nova/storage/translate/0d80c4d8-2584-4675-bae6-7888598b932b/template.docx'
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
        {/* 호진FIXME: 해당 부분 수정 필요함! */}
        <FileItem file={currentFile as File} />
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
