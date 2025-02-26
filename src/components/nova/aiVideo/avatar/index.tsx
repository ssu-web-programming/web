import { useEffect, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_MAKE_AVATARS } from '../../../../api/constant';
import { Avatars, InitAvatarInfo, InitAvatars } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import { ReactComponent as CheckIcon } from '../../../../img/common/ico_check.svg';
import ArrowRightDarkIcon from '../../../../img/dark/ico_arrow_right.svg';
import CircleDarkIcon from '../../../../img/dark/ico_circle.svg';
import CircleSelectedDarkIcon from '../../../../img/dark/ico_circle_selected.svg';
import SqureDarkIcon from '../../../../img/dark/ico_square.svg';
import SqureSelectedDarkIcon from '../../../../img/dark/ico_squre_selected.svg';
import HeyzenLogoDarkIcon from '../../../../img/dark/nova/logo/ico_heygen_name_logo.svg';
import PlusDocDarkIcon from '../../../../img/dark/upload_img_plus_new.svg';
import ArrowRightLightIcon from '../../../../img/light/ico_arrow_right.svg';
import CircleLightIcon from '../../../../img/light/ico_circle.svg';
import CircleSelectedLightIcon from '../../../../img/light/ico_circle_selected.svg';
import CreditColorIcon from '../../../../img/light/ico_credit_color.svg';
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
import { LogoWrap } from './style';

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
              selectedAvatar: result?.info.avatars[0]
                ? { ...InitAvatarInfo, avatar: result.info.avatars[0] }
                : InitAvatarInfo
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

    const currentAvatars = result?.info?.avatars;
    const firstFourAvatars = currentAvatars.slice(0, 4); // 앞의 4개 요소
    const remainingAvatars = currentAvatars.slice(4); // 나머지 요소

    // 선택한 아바타가 앞의 4개 중 하나라면 순서 변경 없이 유지
    if (firstFourAvatars.some((item: Avatars) => item.avatar_id === avatar.avatar_id)) {
      return dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: {
              selectedAvatar: {
                ...result.info.selectedAvatar,
                avatar: avatar
              },
              avatars: currentAvatars // 순서 유지
            }
          }
        })
      );
    }

    // 선택한 아바타가 앞의 4개에 없으면 나머지 목록에서 필터링 후 맨 앞으로 이동
    const updatedAvatars = firstFourAvatars.some(
      (item: Avatars) => item.avatar_id === avatar.avatar_id
    )
      ? currentAvatars
      : [
          avatar,
          ...firstFourAvatars,
          ...remainingAvatars.filter((item: Avatars) => item.avatar_id !== avatar.avatar_id)
        ];

    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            selectedAvatar: {
              ...result.info.selectedAvatar,
              avatar: avatar
            },
            avatars: updatedAvatars
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
              <span className="title">{t('Nova.aiVideo.selectAvatar.title')}</span>
              <div className="show" onClick={() => setIsOpen(true)}>
                <span>{t('Nova.aiVideo.button.showMore')}</span>
                <img src={isLightMode ? ArrowRightLightIcon : ArrowRightDarkIcon} alt="show_more" />
              </div>
            </S.TitleWrap>
            <S.AvartarList>
              {result?.info?.avatars &&
                result?.info?.avatars.slice(0, 4).map((avatar: Avatars) => (
                  <S.AvartarContainer
                    key={avatar.avatar_id}
                    isSelected={result?.info?.selectedAvatar?.avatar?.avatar_id == avatar.avatar_id}
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
            {/*다음 배포에 포함 예정*/}
            {/*<ImageUploader*/}
            {/*  curTab={NOVA_TAB_TYPE.aiVideo}*/}
            {/*  handleUploadComplete={handleUploadedImage}>*/}
            {/*  <S.UploadInner>*/}
            {/*    <img src={isLightMode ? PlusDocLightIcon : PlusDocDarkIcon} alt="doc_plus" />*/}
            {/*    <S.ImageUploadGuide>*/}
            {/*      <span className="title">*/}
            {/*        {t('Nova.aiVideo.selectAvatar.imageUploader.title')}*/}
            {/*      </span>*/}
            {/*      <span className="desc">{t('Nova.aiVideo.selectAvatar.imageUploader.desc')}</span>*/}
            {/*    </S.ImageUploadGuide>*/}
            {/*  </S.UploadInner>*/}
            {/*</ImageUploader>*/}
          </S.AvatarSelectBox>
          <S.TitleWrap>
            <span className="title">{t('Nova.aiVideo.selectAvatar.imageShape.title')}</span>
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
                  <span>
                    {shape === 'normal'
                      ? t('Nova.aiVideo.selectAvatar.imageShape.square')
                      : t('Nova.aiVideo.selectAvatar.imageShape.circle')}
                  </span>
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
          <span>{t('Nova.aiVideo.button.makeVideo')}</span>
          <S.CreditInfo>
            <img src={CreditColorIcon} alt="credit" />
            <span>10</span>
          </S.CreditInfo>
        </Button>
        <S.LogoWrap>
          <img
            src={isLightMode ? HeyzenLogoLightIcon : HeyzenLogoDarkIcon}
            alt="logo"
            className="logo"
          />
        </S.LogoWrap>
      </S.Container>

      {isOpen && <SelectAvatar setIsOpen={setIsOpen} changeSelectedAvatar={changeSelectedAvatar} />}
    </>
  );
}
