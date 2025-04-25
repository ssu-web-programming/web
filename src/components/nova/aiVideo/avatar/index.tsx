import { useEffect, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import { css } from 'styled-components';

import { Avatars, InitAvatarInfo } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import CircleDarkIcon from '../../../../img/dark/ico_circle.svg';
import CircleSelectedDarkIcon from '../../../../img/dark/ico_circle_selected.svg';
import SqureDarkIcon from '../../../../img/dark/ico_square.svg';
import SqureSelectedDarkIcon from '../../../../img/dark/ico_squre_selected.svg';
import darkSkeleton from '../../../../img/dark/nova/aiVideo/skeleton_thumbnail_avatar.json';
import CircleLightIcon from '../../../../img/light/ico_circle.svg';
import CircleSelectedLightIcon from '../../../../img/light/ico_circle_selected.svg';
import SqureLightIcon from '../../../../img/light/ico_square.svg';
import SqureSelectedLightIcon from '../../../../img/light/ico_square_selected.svg';
import lightSkeleton from '../../../../img/light/nova/aiVideo/skeleton_thumbnail_avatar.json';
import {
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Button from '../../../buttons/Button';
import { useGetAvatars } from '../../../hooks/nova/use-get-avatars';
import Radio from '../../../radio';
import AvatarCard from '../component/AvatarCard';
import AvatarSkeleton from '../component/AvatarSkeleton';
import HeygenLogo from '../component/HeygenLogo';

import * as S from './style';

export default function Avatar() {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const { t } = useTranslation();
  const { getAvatars, loading } = useGetAvatars();

  const [gender, setGender] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!result?.info?.selectedAvatar && result?.info.avatars?.length > 0) {
      dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: {
              ...result?.info,
              selectedAvatar: result?.info.avatars[0]
                ? { ...InitAvatarInfo, avatar: result.info.avatars[0] }
                : InitAvatarInfo
            }
          }
        })
      );
    }
  }, [result?.info.avatars]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (gender === 'all') return;

    const filteredAvatars = result?.info?.avatars?.filter(
      (avatar: Avatars) => avatar.gender === gender
    );

    if (filteredAvatars && filteredAvatars.length < 10 && !isLoading) {
      getAvatars();
    }
  }, [gender, result?.info?.avatars]);

  const changeSelectedAvatar = (avatar: Avatars) => {
    if (!result || !result.info.avatars) return;

    const currentAvatars = result?.info?.avatars;

    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            selectedAvatar: {
              ...result.info.selectedAvatar,
              avatar: avatar
            },
            avatars: currentAvatars
          }
        }
      })
    );
  };

  const selectAvatarStyle = (shape: 'circle' | 'normal') => {
    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            selectedAvatar: {
              ...result?.info?.selectedAvatar,
              avatar_style: shape
            }
          }
        }
      })
    );
  };

  const handleNext = () => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'voice' }));
  };

  const handleGenderChange = (newGender: string) => {
    setGender(newGender);

    // 성별 변경 후 필터링된 아바타 확인
    setTimeout(() => {
      const filteredAvatars = result?.info?.avatars?.filter(
        (avatar: Avatars) => newGender === 'all' || avatar.gender === newGender
      );

      // 필터링된 아바타 수가 적으면 추가 로드
      if (filteredAvatars && filteredAvatars.length < 30 && !isLoading) {
        getAvatars();
      }
    }, 0);
  };

  const getShapeIcon = (shape: 'circle' | 'normal') => {
    const isSelected = result?.info?.selectedAvatar?.avatar_style === shape;
    return isLightMode
      ? isSelected
        ? shape === 'normal'
          ? SqureSelectedLightIcon
          : CircleSelectedLightIcon
        : shape === 'normal'
          ? SqureLightIcon
          : CircleLightIcon
      : isSelected
        ? shape === 'normal'
          ? SqureSelectedDarkIcon
          : CircleSelectedDarkIcon
        : shape === 'normal'
          ? SqureDarkIcon
          : CircleDarkIcon;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 50 && !isLoading) {
      getAvatars();
    }
  };

  const renderAvatarSelection = () => {
    return (
      <S.AvatarSelectionContent>
        <S.AvatarPreview>
          <AvatarCard
            isSelected={true}
            selectAvatarStyle={selectAvatarStyle}
            getShapeIcon={getShapeIcon}
          />
        </S.AvatarPreview>

        <S.AvatarSelectionContainer>
          <S.AvatarFilterSection>
            <S.GenderFilter>
              <S.RadioGroup>
                <S.RadioItem>
                  <Radio
                    checked={gender === 'all'}
                    onChange={() => handleGenderChange('all')}
                    size={16}
                  />
                  <S.RadioLabel>{t('Nova.aiVideo.selectAvatar.tabs.all')}</S.RadioLabel>
                </S.RadioItem>
                <S.RadioItem>
                  <Radio
                    checked={gender === 'female'}
                    onChange={() => handleGenderChange('female')}
                    size={16}
                  />
                  <S.RadioLabel>{t('Nova.aiVideo.selectAvatar.tabs.female')}</S.RadioLabel>
                </S.RadioItem>
                <S.RadioItem>
                  <Radio
                    checked={gender === 'male'}
                    onChange={() => handleGenderChange('male')}
                    size={16}
                  />
                  <S.RadioLabel>{t('Nova.aiVideo.selectAvatar.tabs.male')}</S.RadioLabel>
                </S.RadioItem>
              </S.RadioGroup>
            </S.GenderFilter>

            <S.GridContainer onScroll={handleScroll}>
              <S.GridRow>
                {result?.info?.avatars &&
                  result?.info?.avatars
                    .filter((avatar: Avatars) => gender === 'all' || avatar.gender === gender)
                    .map((avatar: Avatars, index: number) => (
                      <S.AvartarContainer
                        key={avatar.avatar_id || index}
                        isSelected={
                          result?.info?.selectedAvatar?.avatar?.avatar_id === avatar.avatar_id
                        }
                        onClick={() => changeSelectedAvatar(avatar)}>
                        <S.OuterBorder
                          isSelected={
                            result?.info.selectedAvatar?.avatar.avatar_id === avatar.avatar_id
                          }
                        />
                        <S.Image
                          src={avatar?.preview_image_url || avatar.talking_photo_url}
                          alt="avatar"
                        />
                      </S.AvartarContainer>
                    ))}
                {isLoading &&
                  ((() => {
                    const currentAvatars =
                      result?.info?.avatars?.filter(
                        (avatar: Avatars) => gender === 'all' || avatar.gender === gender
                      )?.length || 0;

                    const skeletonCount = 4 + (currentAvatars % 4);
                    return Array.from({ length: skeletonCount }, (_, index) => (
                      <S.AvartarContainer key={`skeleton-${index}`} isSelected={false}>
                        <Lottie
                          loop
                          animationData={isLightMode ? lightSkeleton : darkSkeleton}
                          play
                          style={{ width: '100%', height: '100%' }}
                        />
                      </S.AvartarContainer>
                    ));
                  })() as React.ReactNode)}
              </S.GridRow>
            </S.GridContainer>
          </S.AvatarFilterSection>
        </S.AvatarSelectionContainer>

        <S.ButtonContainer>
          <Button
            variant="purple"
            width={'full'}
            height={48}
            onClick={handleNext}
            disable={isLoading}
            cssExt={css`
              display: flex;
              gap: 4px;
              font-size: 16px;
              font-weight: 500;
              border-radius: 8px;
              position: relative;
              min-height: 48px;
            `}>
            <span>{t('Nova.aiVideo.button.next')}</span>
          </Button>
          <HeygenLogo />
        </S.ButtonContainer>
      </S.AvatarSelectionContent>
    );
  };

  return <S.Container>{renderAvatarSelection()}</S.Container>;
}
