import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import {
  selectPageResult,
  selectPageStatus,
  updatePageResult
} from '../../../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch, useAppSelector } from '../../../../../store/store';
import ArrowTooltips from '../../../../ArrowTooltip';
import ColorPicker from '../../../../colorPicker';

import * as S from './style';

interface AvatarCardProps {
  isShowOnlyCard?: boolean;
  isHideColorPicker?: boolean;
  children?: React.ReactNode;
}

export default function AvatarCard({
  isShowOnlyCard = false,
  isHideColorPicker = false,
  children
}: AvatarCardProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));

  const selectAvatarBackground = (color: string) => {
    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            ...result?.info,
            selectedAvatar: {
              ...result?.info?.selectedAvatar,
              background_color: color
            }
          }
        }
      })
    );
  };

  if (!result?.info?.selectedAvatar) {
    return null;
  }

  const selectedAvatar = result.info.selectedAvatar;
  return (
    <S.AvatarCard isCircle={selectedAvatar?.avatar_style === 'circle'}>
      {!isShowOnlyCard && !isHideColorPicker && (
        <ArrowTooltips
          message={t('Nova.aiVideo.tooltip.colorPicker')}
          autoClose={true}
          isReady={status === 'avatar' && selectedAvatar.avatar.avatar_id != ''}
          cssExt={css`
            position: absolute;
            top: 12px;
            right: 12px;
          `}>
          <ColorPicker
            title={t('Nova.aiVideo.ColorPicker.bgColor')}
            color={selectedAvatar?.background_color ?? ''}
            setColor={(color: string) => selectAvatarBackground(color)}
          />
        </ArrowTooltips>
      )}
      <S.PreviewWrap
        isCircle={selectedAvatar?.avatar_style === 'circle'}
        bgColor={selectedAvatar?.background_color ?? ''}>
        <img
          src={
            selectedAvatar?.avatar.avatar_id != ''
              ? selectedAvatar?.avatar.preview_image_url
              : selectedAvatar?.avatar.talking_photo_url
          }
          alt="preview_img"
        />
      </S.PreviewWrap>
      {!isShowOnlyCard && (
        <S.AvatarInfo isCircle={selectedAvatar?.avatar_style === 'circle'}>
          {selectedAvatar?.voice.name ? (
            <>
              <span className="name">{selectedAvatar?.voice.name}</span>
              <span className="etc">{`${selectedAvatar?.voice.language} | ${selectedAvatar?.voice.gender}`}</span>
            </>
          ) : (
            <span className="name">{'-'}</span>
          )}
        </S.AvatarInfo>
      )}
      <>{children}</>
    </S.AvatarCard>
  );
}
