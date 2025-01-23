import IconTextButton from 'components/buttons/IconTextButton';
import { ReactComponent as CheckLightIcon } from 'img/light/nova/check_purple.svg';
import compareViewerIcon from 'img/light/nova/translation/book.svg';
import downloadIcon from 'img/light/nova/translation/download.svg';
import { selectPageData } from 'store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from 'store/slices/tabSlice';
import { useAppSelector } from 'store/store';
import { css } from 'styled-components';

import FileItem from '../file-item';

import * as S from './style';

export default function TranslationFileResult() {
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.convert2DTo3D));

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
        <IconTextButton
          width={'full'}
          height={48}
          borderType="gray"
          onClick={() => console.log('123')}
          iconSrc={compareViewerIcon}
          iconPos={'left'}
          iconSize={24}
          cssExt={css`
            border-radius: 8px;
            font-size: 15px;
          `}>
          {'원본-번역 비교 보기'}
        </IconTextButton>
        <IconTextButton
          width={'full'}
          height={48}
          onClick={() => console.log('123')}
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
