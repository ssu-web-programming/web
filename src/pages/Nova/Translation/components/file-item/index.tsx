import Icon from 'components/Icon';
import { getFileIcon } from 'components/nova/inputBar';
import { setDriveFiles } from 'store/slices/uploadFiles';
import { useAppDispatch } from 'store/store';

import * as S from './style';

interface Props {
  fileName?: string;
  isDeleteIcon?: boolean;
}

export default function FileItem({ fileName, isDeleteIcon = true }: Props) {
  const dispatch = useAppDispatch();
  return (
    <S.Wrapper>
      <S.IconContainer>
        <Icon size={45} iconSrc={getFileIcon(fileName as string)} />
        {isDeleteIcon && (
          <S.DeleteIcon
            onClick={() => {
              dispatch(setDriveFiles([]));
            }}
          />
        )}
      </S.IconContainer>
      <S.FileName>{fileName || ''}</S.FileName>
    </S.Wrapper>
  );
}
