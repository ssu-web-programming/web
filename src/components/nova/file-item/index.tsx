import Icon from 'components/Icon';
import { getFileIcon } from 'components/nova/inputBar';
import {
  removeCurrentFile,
  setCurrentFile,
  setDriveFiles,
  setLocalFiles
} from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';

import { resetPageData } from '../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';

import * as S from './style';

interface Props {
  fileName?: string;
  isDeleteIcon?: boolean;
  iconSize?: number;
}

export default function FileItem({ fileName, isDeleteIcon = true, iconSize = 60 }: Props) {
  const dispatch = useAppDispatch();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  return (
    <S.Wrapper>
      <S.IconContainer>
        <Icon size={iconSize} iconSrc={getFileIcon(fileName as string)} />
        {isDeleteIcon && (
          <S.DeleteIcon
            onClick={() => {
              dispatch(setDriveFiles([]));
              dispatch(setLocalFiles([]));
              dispatch(resetPageData(selectedNovaTab));
            }}
          />
        )}
      </S.IconContainer>
      <S.FileName>{fileName || ''}</S.FileName>
    </S.Wrapper>
  );
}
