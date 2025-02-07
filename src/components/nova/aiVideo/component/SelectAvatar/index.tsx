import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { AvatarInfo, Avatars, InitAvatarInfo } from '../../../../../constants/heygenTypes';
import { ReactComponent as CheckIcon } from '../../../../../img/common/ico_check.svg';
import CloseDarkIcon from '../../../../../img/dark/ico_nova_close.svg';
import CloseLightIcon from '../../../../../img/light/ico_nova_close.svg';
import { screenModeSelector } from '../../../../../store/slices/screenMode';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppSelector } from '../../../../../store/store';
import { isMobile } from '../../../../../util/bridge';
import Blanket from '../../../../Blanket';
import Button from '../../../../buttons/Button';

import * as S from './styles';

interface SelectAvatarProps {
  avatarList: Avatars[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedAvatar: AvatarInfo | null;
  setSelectedAvatar: Dispatch<SetStateAction<AvatarInfo | null>>;
}

enum ETabType {
  all,
  male,
  female
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function SelectAvatar({
  avatarList,
  setIsOpen,
  selectedAvatar,
  setSelectedAvatar
}: SelectAvatarProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { screenMode } = useAppSelector(screenModeSelector);
  const { t } = useTranslation();
  const [tab, setTab] = useState<ETabType>(ETabType.all);
  const [tempAvatar, setTempAvatar] = useState<Avatars | null>(null);

  const tabKeys = Object.keys(ETabType).filter((key) => isNaN(Number(key))) as Array<
    keyof typeof ETabType
  >;

  useEffect(() => {
    if (selectedAvatar) setTempAvatar(selectedAvatar.avatar);
  }, [selectedAvatar]);

  const handleChange = (event: React.SyntheticEvent, tab: ETabType) => {
    setTab(tab);
  };

  const handleImageClick = (avatar: Avatars) => {
    setTempAvatar(avatar);
  };

  const handleSelectAvatar = () => {
    if (tempAvatar) {
      setSelectedAvatar((prev) => (prev ? { ...prev, avatar: tempAvatar } : null));
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
          return (
            tab === tabValue && (
              <S.ListWrap role="tabpanel" hidden={tabValue !== tabValue}>
                {avatarList.map((avatar) => (
                  <S.AvartarContainer
                    key={avatar.avatar_id}
                    isSelected={tempAvatar?.avatar_id === avatar.avatar_id}>
                    <S.OuterBorder isSelected={tempAvatar?.avatar_id === avatar.avatar_id} />
                    {tempAvatar?.avatar_id === avatar.avatar_id && (
                      <S.CheckBox>
                        <CheckIcon />
                      </S.CheckBox>
                    )}
                    <S.Image
                      src={avatar.preview_image_url}
                      alt={'avatar'}
                      onClick={() => handleImageClick(avatar)}
                    />
                  </S.AvartarContainer>
                ))}
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
