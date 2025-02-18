import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import Tab from '@mui/material/Tab';
import { result } from 'lodash';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import { css } from 'styled-components';

import { AvatarInfo, Avatars, InitAvatarInfo } from '../../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { ReactComponent as CheckIcon } from '../../../../../img/common/ico_check.svg';
import CloseDarkIcon from '../../../../../img/dark/ico_nova_close.svg';
import SkeletonDark from '../../../../../img/dark/nova/aiVideo/skeleton_thumbnail_avatar.json';
import SpinnerDark from '../../../../../img/dark/nova/nova_spinner.json';
import CloseLightIcon from '../../../../../img/light/ico_nova_close.svg';
import SkeletonLight from '../../../../../img/light/nova/aiVideo/skeleton_thumbnail_avatar.json';
import SpinnerLight from '../../../../../img/light/nova/nova_spinner.json';
import { selectPageResult } from '../../../../../store/slices/nova/pageStatusSlice';
import { screenModeSelector } from '../../../../../store/slices/screenMode';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppSelector } from '../../../../../store/store';
import { isMobile } from '../../../../../util/bridge';
import Blanket from '../../../../Blanket';
import Button from '../../../../buttons/Button';
import { useGetAvatars } from '../../../../hooks/nova/use-get-avatars';

import * as S from './styles';

interface SelectAvatarProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  changeSelectedAvatar: (avatar: Avatars) => void;
}

enum ETabType {
  all,
  male,
  female
}

export default function SelectAvatar({ setIsOpen, changeSelectedAvatar }: SelectAvatarProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { screenMode } = useAppSelector(screenModeSelector);
  const { t } = useTranslation();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const [tab, setTab] = useState<ETabType>(ETabType.all);
  const [tempAvatar, setTempAvatar] = useState<Avatars | null>(null);

  const tabKeys = Object.keys(ETabType).filter((key) => isNaN(Number(key))) as Array<
    keyof typeof ETabType
  >;

  const { getAvatars, hasMore, loading } = useGetAvatars();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastAvatarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result?.info.selectedAvatar) setTempAvatar(result?.info.selectedAvatar.avatar);
  }, [result?.info.selectedAvatar]);

  useEffect(() => {
    if (loading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          getAvatars(ETabType[tab]);
        }
      },
      { threshold: 0.5 }
    );

    if (lastAvatarRef.current) {
      observerRef.current.observe(lastAvatarRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, hasMore, tab]);

  const handleChange = (event: React.SyntheticEvent, tab: ETabType) => {
    setTab(tab);
  };

  const handleImageClick = (avatar: Avatars) => {
    setTempAvatar(avatar);
  };

  const handleSelectAvatar = () => {
    if (tempAvatar) {
      changeSelectedAvatar(tempAvatar);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Blanket />
      <S.Container $isMobile={isMobile} $isMin={screenMode === 'min'}>
        <S.TitleWrap>
          <div>아바타 선택</div>
          <img
            src={isLightMode ? CloseLightIcon : CloseDarkIcon}
            alt="close"
            onClick={() => setIsOpen(false)}
          />
        </S.TitleWrap>
        <S.CustomTabs value={tab} onChange={handleChange}>
          <Tab label="전체" value={ETabType.all} />
          <Tab label="남성" value={ETabType.male} />
          <Tab label="여성" value={ETabType.female} />
        </S.CustomTabs>
        {tabKeys.map((tabKey) => {
          const tabValue = ETabType[tabKey as keyof typeof ETabType];
          const filteredAvatars = result?.info.avatars.filter((avatar: Avatars) => {
            if (tab === ETabType.all) return true;
            if (tab === ETabType.male) return avatar.gender === 'male';
            if (tab === ETabType.female) return avatar.gender === 'female';
            return false;
          });

          return (
            tab === tabValue && (
              <S.ListWrap role="tabpanel" hidden={tabValue !== tabValue}>
                {filteredAvatars?.map((avatar: Avatars, index: number) => (
                  <S.AvartarContainer
                    key={avatar.avatar_id}
                    isSelected={tempAvatar?.avatar_id === avatar.avatar_id}
                    ref={index === filteredAvatars.length - 1 ? lastAvatarRef : null}>
                    <S.OuterBorder isSelected={tempAvatar?.avatar_id === avatar.avatar_id} />
                    {tempAvatar?.avatar_id === avatar.avatar_id && (
                      <S.CheckBox>
                        <CheckIcon />
                      </S.CheckBox>
                    )}
                    <S.Image
                      src={avatar?.preview_image_url || avatar.talking_photo_url}
                      alt={'avatar'}
                      onClick={() => handleImageClick(avatar)}
                    />
                  </S.AvartarContainer>
                ))}
                {loading &&
                  Array.from({ length: Math.max(0, 3 - (filteredAvatars.length % 3)) }).map(
                    (_, index) => (
                      <Lottie
                        key={index}
                        animationData={isLightMode ? SkeletonLight : SkeletonDark}
                        loop
                        play
                      />
                    )
                  )}
              </S.ListWrap>
            )
          );
        })}
        <S.ButtonWrap>
          <Button
            variant="purple"
            width={'full'}
            height={48}
            cssExt={css`
              display: flex;
              gap: 4px;
              font-size: 16px;
              font-weight: 500;
              border-radius: 8px;
              position: relative;
            `}
            onClick={handleSelectAvatar}>
            <span>{'선택하기'}</span>
          </Button>
        </S.ButtonWrap>
      </S.Container>
    </>
  );
}
