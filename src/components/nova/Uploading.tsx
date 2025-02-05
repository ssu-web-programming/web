import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';
import { ReactComponent as UploadDocs } from '../../img/light/ico_upload_docs_plus.svg';
import { ReactComponent as UploadImg } from '../../img/light/ico_upload_img_plus.svg';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';

const Dim = styled.div`
  width: 100%;
  height: calc(100% - 56px);
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.7);
  z-index: 20;
`;

const UploadWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed #c6a9ff;
  border-radius: 8px;
  background-color: #f5f1fd;
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    width: 48px;
    height: 48px;
    color: #6f3ad0;
  }
`;

const Text = styled.span`
  width: 100%;
  text-align: center;
  white-space: break-spaces;
  color: #6f3ad0;

  &.title {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
  }

  &.desc {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
`;

export default function Uploading() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  return (
    <Dim>
      <UploadWrap>
        <IconWrap>
          {selectedNovaTab === NOVA_TAB_TYPE.aiChat && <UploadDocs />}
          <UploadImg />
        </IconWrap>
        <Text className="title">{t(`Nova.DragAndDrop.Title`)}</Text>
        <Text className="desc">{t(`Nova.DragAndDrop.Desc`)}</Text>
      </UploadWrap>
    </Dim>
  );
}
