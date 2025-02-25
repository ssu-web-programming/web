import Icon from 'components/Icon';
import { getFileIcon } from 'components/nova/inputBar';
import { setDriveFiles } from 'store/slices/uploadFiles';
import { useAppDispatch } from 'store/store';

import * as S from './style';

interface Props {
  fileName?: string;
}

export default function FileItem({ fileName }: Props) {
  const dispatch = useAppDispatch();
  return (
    <S.Wrapper>
      <S.DeleteIcon
        onClick={() => {
          dispatch(setDriveFiles([]));
        }}
      />
      <Icon size={45} iconSrc={getFileIcon(fileName as string)} />
      <S.FileName>{fileName || ''}</S.FileName>
    </S.Wrapper>
  );
}
