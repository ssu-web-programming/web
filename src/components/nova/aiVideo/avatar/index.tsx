import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as React from 'react';
import { css } from 'styled-components';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_AVATARS } from '../../../../api/constant';
import {
  AvatarInfo,
  Avatars,
  InitAvatarInfo,
  InitAvatars
} from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import { ReactComponent as CheckIcon } from '../../../../img/common/ico_check.svg';
import CircleDarkIcon from '../../../../img/dark/ico_circle.svg';
import CircleSelectedDarkIcon from '../../../../img/dark/ico_circle_selected.svg';
import SqureDarkIcon from '../../../../img/dark/ico_square.svg';
import SqureSelectedDarkIcon from '../../../../img/dark/ico_squre_selected.svg';
import ArrowRightIcon from '../../../../img/light/ico_arrow_right.svg';
import CircleLightIcon from '../../../../img/light/ico_circle.svg';
import CircleSelectedLightIcon from '../../../../img/light/ico_circle_selected.svg';
import CreditColorIcon from '../../../../img/light/ico_credit_color.svg';
import SqureLightIcon from '../../../../img/light/ico_square.svg';
import SqureSelectedLightIcon from '../../../../img/light/ico_square_selected.svg';
import PlusDocLightIcon from '../../../../img/light/upload_img_plus_new.svg';
import {
  resetPageData,
  selectPageData,
  selectPageResult,
  setPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { setLocalFiles } from '../../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Button from '../../../buttons/Button';
import ImageUploader from '../../ImageUploader';
import AvatarCard from '../component/AvatarCard';
import SelectAvatar from '../component/SelectAvatar';

import * as S from './style';

interface AvatarProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function Avatar({ activeStep, setActiveStep }: AvatarProps) {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.aiVideo));
  const [avatarList, setAvatarList] = useState<Avatars[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    getAvartarList();
  }, []);

  useEffect(() => {
    if (!result?.info && avatarList.length > 0) {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            contentType: '',
            data: '',
            link: '',
            info: {
              selectedAvatar: result?.info?.selectedAvatar
                ? { ...result.info.selectedAvatar }
                : { ...InitAvatarInfo, avatar: avatarList[0] }
            }
          }
        })
      );
    }
  }, [avatarList]);

  const getAvartarList = async () => {
    const { res } = await apiWrapper().request(NOVA_VIDEO_GET_AVATARS, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    const { data } = await res.json();
    setAvatarList(data.avatars);
  };

  const changeSelectedAvatar = (avatar: Avatars) => {
    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            selectedAvatar: {
              ...result?.info?.selectedAvatar,
              avatar: avatar
            }
          }
        }
      })
    );
    setAvatarList(
      avatar
        ? [avatar, ...avatarList.filter((item) => item.avatar_id !== avatar.avatar_id)]
        : avatarList
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
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'avatar' }));
      changeSelectedAvatar({ ...InitAvatars, file: currentFile });
      dispatch(resetPageData(NOVA_TAB_TYPE.aiVideo));
      dispatch(setLocalFiles([]));
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
                <span>더 보기</span>
                <img src={ArrowRightIcon} alt="show_more" />
              </div>
            </S.TitleWrap>
            <S.AvartarList>
              {avatarList.slice(0, 4).map((avatar) => (
                <S.AvartarContainer
                  key={avatar.avatar_id}
                  isSelected={result?.info.selectedAvatar?.avatar.avatar_id === avatar.avatar_id}>
                  <S.OuterBorder
                    isSelected={result?.info.selectedAvatar?.avatar.avatar_id === avatar.avatar_id}
                  />
                  {result?.info.selectedAvatar?.avatar.avatar_id === avatar.avatar_id && (
                    <S.CheckBox>
                      <CheckIcon />
                    </S.CheckBox>
                  )}
                  <S.Image
                    src={
                      avatar?.file ? URL.createObjectURL(avatar.file) : avatar?.preview_image_url
                    }
                    alt={'avatar'}
                    onClick={() => changeSelectedAvatar(avatar)}
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
          cssExt={css`
            display: flex;
            gap: 4px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            position: relative;
          `}
          onClick={() => {
            setActiveStep(activeStep + 1);
            dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'voice' }));
          }}>
          <span>{'AI 비디오 만들기'}</span>
          <S.CreditInfo>
            <img src={CreditColorIcon} alt="credit" />
            <span>10</span>
          </S.CreditInfo>
        </Button>
      </S.Container>

      {isOpen && (
        <SelectAvatar
          avatarList={avatarList}
          setIsOpen={setIsOpen}
          selectedAvatar={result?.info.selectedAvatar}
          changeSelectedAvatar={(avatar: Avatars) => changeSelectedAvatar(avatar)}
        />
      )}
    </>
  );
}
