import Icon from 'components/Icon';
import { getFileIcon } from 'components/nova/inputBar';

import * as S from './style';

interface Props {
  fileName?: string;
}

export default function FileItem({ fileName }: Props) {
  return (
    <S.Wrapper>
      <Icon size={45} iconSrc={getFileIcon(fileName as string)} />
      <S.FileName>{fileName || ''}</S.FileName>
    </S.Wrapper>
  );
}
