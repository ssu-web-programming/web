import { useEffect, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_MAKE_AVATARS } from '../../../../api/constant';
import { Avatars, InitAvatarInfo, InitAvatars } from '../../../../constants/heygenTypes';
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
import PlusDocLightIcon from '../../../../img/light/upload_img_plus_new.svg';
import {
  resetPageData,
  selectPageData,
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { setLocalFiles } from '../../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Button from '../../../buttons/Button';
import useErrorHandle from '../../../hooks/useErrorHandle';
import ImageUploader from '../../ImageUploader';
import AvatarCard from '../component/AvatarCard';
import SelectAvatar from '../component/SelectAvatar';

import * as S from './style';

export default function Avatar() {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { t } = useTranslation();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.aiVideo));
  const errorHandle = useErrorHandle();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!result?.info?.selectedAvatar && result?.info.avatars?.length > 0) {
      dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: {
              ...result?.info,
              selectedAvatar: { ...InitAvatarInfo, avatar: result?.info.avatars[0] }
            }
          }
        })
      );
    }
  }, [result?.info.avatars]);

  const makeAvatars = async () => {
    if (!currentFile) return;

    const formData = new FormData();
    formData.append('file', currentFile);

    try {
      const { res } = await apiWrapper().request(NOVA_VIDEO_MAKE_AVATARS, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      changeSelectedAvatar({
        ...InitAvatars,
        talking_photo_id: data.data.talking_photo_id,
        talking_photo_url: data.data.talking_photo_url
      });
    } catch (error) {
      errorHandle(error);
    }
  };

  const changeSelectedAvatar = (avatar: Avatars) => {
    if (!result || !result.info.avatars) return;

    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            selectedAvatar: {
              ...result.info.selectedAvatar,
              avatar: avatar
            },
            avatars: [
              avatar,
              ...result.info.avatars.filter((item: Avatars) => item.avatar_id !== avatar.avatar_id)
            ]
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

  const getShapeIcon = (shape: 'circle' | 'normal') => {
    const isSelected = result?.info.selectedAvatar?.avatar_style === shape;
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

  const handleUploadedImage = () => {
    if (currentFile) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'progress' }));
      makeAvatars().then(() => {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'avatar' }));
        dispatch(resetPageData(NOVA_TAB_TYPE.aiVideo));
        dispatch(setLocalFiles([]));
      });
    }
  };

  return (
    <>
      <S.Container>
        <AvatarCard />
        <S.ContentWrap>
          <S.AvatarSelectBox>
            <S.TitleWrap>
              <span className="title">아바타 선택</span>
              <div className="show" onClick={() => setIsOpen(true)}>
                <span>{t('Nova.aiVideo.button.showMore')}</span>
              </div>
            </S.TitleWrap>
            <S.AvartarList>
              {result?.info.avatars &&
                result?.info.avatars.slice(0, 4).map((avatar: Avatars) => (
                  <S.AvartarContainer
                    key={avatar.avatar_id}
                    isSelected={result?.info?.selectedAvatar?.avatar.avatar_id == avatar.avatar_id}
                    onClick={() => changeSelectedAvatar(avatar)}>
                    <S.OuterBorder
                      isSelected={
                        result?.info.selectedAvatar?.avatar.avatar_id === avatar.avatar_id
                      }
                    />
                    {result?.info.selectedAvatar?.avatar.avatar_id === avatar.avatar_id && (
                      <S.CheckBox>
                        <CheckIcon />
                      </S.CheckBox>
                    )}
                    <S.Image
                      src={avatar?.preview_image_url || avatar.talking_photo_url}
                      alt="avatar"
                    />
                  </S.AvartarContainer>
                ))}
            </S.AvartarList>
            <ImageUploader
              curTab={NOVA_TAB_TYPE.aiVideo}
              handleUploadComplete={handleUploadedImage}>
              <S.UploadInner>
                <img src={PlusDocLightIcon} alt="doc_plus" />
                <S.ImageUploadGuide>
                  <span className="title">나만의 아바타 만들기</span>
                  <span className="desc">JPG, PNG 형식, 최대 50MB 지원</span>
                </S.ImageUploadGuide>
              </S.UploadInner>
            </ImageUploader>
          </S.AvatarSelectBox>
          <S.TitleWrap>
            <span className="title">이미지 형태</span>
            <S.ButtonWrap>
              {['normal', 'circle'].map((shape) => (
                <Button
                  key={shape}
                  variant="lightPurple"
                  width={85}
                  height={36}
                  selected={result?.info.selectedAvatar?.avatar_style === shape}
                  cssExt={css`
                    display: flex;
                    gap: 4px;
                    font-size: 14px;
                    font-weight: 500;
                    border-radius: 8px;
                    padding: 6px 8px;
                  `}
                  onClick={() => selectAvatarStyle(shape as 'circle' | 'normal')}>
                  <img src={getShapeIcon(shape as 'circle' | 'normal')} alt={shape} />
                  <span>{shape === 'normal' ? '사각형' : '원형'}</span>
                </Button>
              ))}
            </S.ButtonWrap>
          </S.TitleWrap>
        </S.ContentWrap>
        <Button
          variant="purple"
          width={'full'}
          height={48}
          disable={true}
          cssExt={css`
            display: flex;
            gap: 4px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            position: relative;
          `}
          onClick={() => {
            dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'voice' }));
          }}>
          <span>{'AI 비디오 만들기'}</span>
        </Button>
        <img
          src={isLightMode ? HeyzenLogoLightIcon : HeyzenLogoDarkIcon}
          alt="logo"
          className="logo"
        />
      </S.Container>

      {isOpen && <SelectAvatar setIsOpen={setIsOpen} changeSelectedAvatar={changeSelectedAvatar} />}
    </>
  );
}
