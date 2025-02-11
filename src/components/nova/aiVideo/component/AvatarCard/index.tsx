import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { css } from 'styled-components';

import { AvatarInfo } from '../../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import HeyZenDarkIcon from '../../../../../img/dark/nova/logo/ico_heygen_logo.svg';
import HeyZenLightIcon from '../../../../../img/light/nova/logo/ico_heygen_logo.svg';
import {
  selectPageResult,
  updatePageResult
} from '../../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../../store/store';
import ColorPicker from '../../../../colorPicker';

import * as S from './style';

interface AvatarCardProps {
  isShowOnlyCard?: boolean;
  children?: React.ReactNode;
}

export default function AvatarCard({ isShowOnlyCard = false, children }: AvatarCardProps) {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));

  const selectAvatarBackground = (color: string) => {
    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
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
      <img src={isLightMode ? HeyZenLightIcon : HeyZenDarkIcon} alt="logo" className="logo" />
      {!isShowOnlyCard && (
        <ColorPicker
          title="배경 색상"
          color={result?.info.selectedAvatar?.background_color ?? ''}
          setColor={(color: string) => selectAvatarBackground(color)}
          cssExt={css`
            position: absolute;
            top: 12px;
            right: 12px;
          `}
        />
      )}
      <S.PreviewWrap
        isCircle={result?.info.selectedAvatar?.avatar_style === 'circle'}
        bgColor={result?.info.selectedAvatar?.background_color ?? ''}>
        <img
          src={
            result?.info.selectedAvatar?.avatar.file
              ? URL.createObjectURL(result?.info.selectedAvatar.avatar.file)
              : result?.info.selectedAvatar?.avatar.preview_image_url
          }
          alt="preview_img"
        />
      </S.PreviewWrap>
      {!isShowOnlyCard && (
        <S.AvatarInfo>
          <span className="name">{result?.info.selectedAvatar?.voice.name}</span>
          <span className="etc">{`${result?.info.selectedAvatar?.voice.language} | ${result?.info.selectedAvatar?.voice.gender}`}</span>
        </S.AvatarInfo>
      )}
      <>{children}</>
    </S.AvatarCard>
  );
}
