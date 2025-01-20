import { ReactComponent as CheckLightIcon } from 'img/light/nova/check_purple.svg';
import { selectPageData } from 'store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from 'store/slices/tabSlice';
import { useAppSelector } from 'store/store';

import FileItem from '../file-item';

import * as S from './style';

export default function TranslationFileResult() {
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.convert2DTo3D));

  return (
    <>
      <S.Title>
        <CheckLightIcon />
        <span>파일 번역 완료</span>
      </S.Title>
      <S.SubTitle>
        <p>원하는 언어로 번역이 완료되었어요!</p>
        <p>저장하고 바로 번역된 내용을 확인해보세요!</p>
      </S.SubTitle>
      <div>
        <FileItem file={currentFile as File} />
      </div>
    </>
  );
}
