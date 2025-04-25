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
import GuideMessage from '../GuideMessage';

import * as S from './style';

interface AvatarCardProps {
  isShowOnlyCard?: boolean;
  isHideColorPicker?: boolean;
  isScriptStep?: boolean;
  children?: React.ReactNode;
  isSelected?: boolean;
  selectAvatarStyle?: (shape: 'circle' | 'normal') => void;
  getShapeIcon?: (shape: 'circle' | 'normal') => string;
  image?: string;
  name?: string;
  country?: string;
  gender?: string;
}

export default function AvatarCard({
  isShowOnlyCard = false,
  isHideColorPicker = false,
  isScriptStep = false,
  children,
  isSelected = true,
  selectAvatarStyle,
  getShapeIcon,
  image,
  name,
  country,
  gender
}: AvatarCardProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const selectedAvatar = result?.info?.selectedAvatar;
  const avatarStyle = selectedAvatar?.avatar_style;
  const isCircleStyle = avatarStyle === 'circle';
  const bgColor = selectedAvatar?.background_color || 'transparent';

  const imageUrl =
    image || selectedAvatar?.avatar?.preview_image_url || selectedAvatar?.avatar?.talking_photo_url;

  const voiceName = name || selectedAvatar?.voice?.name || '-';

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

  const handleAvatarStyleChange = (style: 'circle' | 'square') => {
    if (selectAvatarStyle && style === 'circle') {
      selectAvatarStyle('circle');
    } else if (selectAvatarStyle && style === 'square') {
      selectAvatarStyle('normal');
    } else {
      dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: {
              ...result?.info,
              selectedAvatar: {
                ...result?.info?.selectedAvatar,
                avatar_style: style === 'square' ? 'normal' : 'circle'
              }
            }
          }
        })
      );
    }
  };

  const renderCard = () => {
    const isAvatarStep = status === 'avatar';

    return (
      <S.AvatarCard isCircle={isCircleStyle}>
        <S.AvatarContentContainer>
          <S.AvatarImageContainer
            isCircle={isCircleStyle}
            bgColor={bgColor}
            isSelected={isScriptStep ? false : isAvatarStep}>
            <S.AvatarImageWrapper>
              {imageUrl ? (
                <S.AvatarImageElement src={imageUrl} alt={voiceName} isCircle={isCircleStyle} />
              ) : (
                <S.AvatarImage isCircle={isCircleStyle} />
              )}
            </S.AvatarImageWrapper>
          </S.AvatarImageContainer>

          {!isShowOnlyCard && !isHideColorPicker && (
            <S.AvatarStyleContainer>
              <ArrowTooltips
                message={t('Nova.aiVideo.tooltip.colorPicker')}
                autoClose={true}
                isReady={
                  status === 'avatar' && result?.info?.selectedAvatar?.avatar?.avatar_id !== ''
                }
                placement="top-start"
                cssExt={css`
                  margin-bottom: 4px;
                  right: 0;
                `}>
                <ColorPicker
                  title={t('Nova.aiVideo.ColorPicker.bgColor')}
                  color={result?.info?.selectedAvatar?.background_color ?? ''}
                  setColor={(color: string) => selectAvatarBackground(color)}
                />
              </ArrowTooltips>

              <S.AvatarStyleSelector>
                <S.AvatarStyleOption
                  isSelected={!isCircleStyle}
                  onClick={() => handleAvatarStyleChange('square')}>
                  {getShapeIcon ? (
                    <img src={getShapeIcon('normal')} alt="Square" />
                  ) : (
                    <S.AvatarStyleSquare />
                  )}
                </S.AvatarStyleOption>
                <S.AvatarStyleOption
                  isSelected={isCircleStyle}
                  onClick={() => handleAvatarStyleChange('circle')}>
                  {getShapeIcon ? (
                    <img src={getShapeIcon('circle')} alt="Circle" />
                  ) : (
                    <S.AvatarStyleCircle />
                  )}
                </S.AvatarStyleOption>
              </S.AvatarStyleSelector>
            </S.AvatarStyleContainer>
          )}
        </S.AvatarContentContainer>

        {!isShowOnlyCard && (
          <S.AvatarInfo isCircle={isCircleStyle} isSelected={status === 'voice'}>
            <GuideMessage audioRef={audioRef} />
          </S.AvatarInfo>
        )}
        {children}
      </S.AvatarCard>
    );
  };

  return (
    <>
      {renderCard()}
      <audio ref={audioRef} muted={false} />
    </>
  );
}
