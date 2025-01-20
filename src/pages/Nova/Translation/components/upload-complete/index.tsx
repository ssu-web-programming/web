import { ReactComponent as DocxIcon } from 'img/light/nova/translation/docx_icon.svg';

import * as S from './style';

interface Props {
  file: File;
}

export default function UploadComplete({ file }: Props) {
  return (
    <S.Wrapper>
      <DocxIcon />
      <S.FileName>{file.name}</S.FileName>
    </S.Wrapper>
  );
}
