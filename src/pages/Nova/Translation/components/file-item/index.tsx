import { ReactComponent as DocxIcon } from 'img/light/nova/translation/docx_icon.svg';

import * as S from './style';

interface Props {
  fileName?: string;
}

export default function FileItem({ fileName }: Props) {
  return (
    <S.Wrapper>
      <DocxIcon />
      <S.FileName>{fileName || ''}</S.FileName>
    </S.Wrapper>
  );
}
