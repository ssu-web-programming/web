import { useEffect, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_AVATARS } from '../../../../api/constant';
import { Avatars, InitAvatarInfo } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import { ReactComponent as CheckIcon } from '../../../../img/common/ico_check.svg';
import CircleDarkIcon from '../../../../img/dark/ico_circle.svg';
import CircleSelectedDarkIcon from '../../../../img/dark/ico_circle_selected.svg';
import SqureDarkIcon from '../../../../img/dark/ico_square.svg';
import SqureSelectedDarkIcon from '../../../../img/dark/ico_squre_selected.svg';
import HeyzenLogoDarkIcon from '../../../../img/dark/nova/logo/ico_heygen_name_logo.svg';
import CircleLightIcon from '../../../../img/light/ico_circle.svg';
import CircleSelectedLightIcon from '../../../../img/light/ico_circle_selected.svg';
import SqureLightIcon from '../../../../img/light/ico_square.svg';
import SqureSelectedLightIcon from '../../../../img/light/ico_square_selected.svg';
import HeyzenLogoLightIcon from '../../../../img/light/nova/logo/ico_heygen_name_logo.svg';
import {
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Button from '../../../buttons/Button';
import Radio from '../../../radio';
import AvatarCard from '../component/AvatarCard';
import AvatarSkeleton from '../component/AvatarSkeleton';
import HeygenLogo from '../component/HeygenLogo';

import * as S from './style';

export default function Avatar() {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { t } = useTranslation();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));

  const [gender, setGender] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!result?.info?.avatars || result.info.avatars.length === 0) {
      loadMoreAvatars();
    }
  }, [gender]);

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

  const loadMoreAvatars = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const currentPage = result?.info.avatarPage ?? 1;
      const { res } = await apiWrapper().request(
        `${NOVA_VIDEO_GET_AVATARS}?page=${currentPage}&limit=30&gender=${gender}`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        }
      );

      const { data } = await res.json();
      if (data.avatars.length > 0) {
        dispatch(
          updatePageResult({
            tab: NOVA_TAB_TYPE.aiVideo,
            result: {
              contentType: '',
              data: '',
              link: '',
              info: {
                ...result?.info,
                avatarPage: currentPage + 1,
                avatars: [...(result?.info?.avatars ?? []), ...data.avatars]
              }
            }
          })
        );
      }
    } catch (error) {
      console.error('아바타 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleGenderChange = (selected: string) => {
    setGender(selected);

    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            ...result?.info,
            avatarPage: 1,
            avatars: []
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
      loadMoreAvatars();
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
                  result?.info?.avatars.map((avatar: Avatars, index: number) => (
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
                {/* 로딩 상태에 따라 스켈레톤 표시 */}
                {(() => {
                  if (isLoading) {
                    return (
                      <S.SkeletonWrap>
                        <AvatarSkeleton count={20} />
                      </S.SkeletonWrap>
                    );
                  }
                  return null;
                })()}
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
