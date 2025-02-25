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

  return (
    <S.AvatarCard isCircle={result?.info.selectedAvatar?.avatar_style === 'circle'}>
      {!isShowOnlyCard && !isHideColorPicker && (
        <ArrowTooltips
          message={t('Nova.aiVideo.tooltip.colorPicker')}
          autoClose={true}
          isReady={status === 'avatar' && result?.info.selectedAvatar.avatar.avatar_id != ''}
          cssExt={css`
            position: absolute;
            top: 12px;
            right: 12px;
          `}>
          <ColorPicker
            title={t('Nova.aiVideo.ColorPicker.bgColor')}
            color={result?.info.selectedAvatar?.background_color ?? ''}
            setColor={(color: string) => selectAvatarBackground(color)}
          />
        </ArrowTooltips>
      )}
      <S.PreviewWrap
        isCircle={result?.info.selectedAvatar?.avatar_style === 'circle'}
        bgColor={result?.info.selectedAvatar?.background_color ?? ''}>
        <img
          src={
            result?.info.selectedAvatar?.avatar.avatar_id != ''
              ? result?.info.selectedAvatar?.avatar.preview_image_url
              : result?.info.selectedAvatar?.avatar.talking_photo_url
          }
          alt="preview_img"
        />
      </S.PreviewWrap>
      {!isShowOnlyCard && (
        <S.AvatarInfo isCircle={result?.info.selectedAvatar?.avatar_style === 'circle'}>
          {result?.info.selectedAvatar?.voice.name ? (
            <>
              <span className="name">{result?.info.selectedAvatar?.voice.name}</span>
              <span className="etc">{`${result?.info.selectedAvatar?.voice.language} | ${result?.info.selectedAvatar?.voice.gender}`}</span>
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
