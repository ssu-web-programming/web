import React from 'react';
import { useTranslation } from 'react-i18next';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { ReactComponent as UploadDocs } from '../../../img/light/ico_upload_docs_plus.svg';
import { ReactComponent as UploadImg } from '../../../img/light/ico_upload_img_plus.svg';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { useAppSelector } from '../../../store/store';

import * as S from './style';

export default function Uploading() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  return (
    <S.Dim>
      <S.UploadWrap>
        <S.IconWrap>
          {selectedNovaTab === NOVA_TAB_TYPE.aiChat && <UploadDocs />}
          <UploadImg />
        </S.IconWrap>
        <S.Text className="title">{t(`Nova.DragAndDrop.Title`)}</S.Text>
        <S.Text className="desc">{t(`Nova.DragAndDrop.Desc`)}</S.Text>
      </S.UploadWrap>
    </S.Dim>
  );
}
