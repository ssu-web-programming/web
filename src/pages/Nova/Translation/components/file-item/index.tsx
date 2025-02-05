import { ReactComponent as DocxIcon } from 'img/light/nova/translation/docx_icon.svg';
import { DriveFileInfo } from 'store/slices/uploadFiles';

import * as S from './style';

interface Props {
  file?: File | DriveFileInfo | null;
}

export default function FileItem({ file }: Props) {
  return (
    <S.Wrapper>
      <DocxIcon />
      <S.FileName>{file?.name || '저장/비교 보기 눌러주세요.'}</S.FileName>
    </S.Wrapper>
  );
}
