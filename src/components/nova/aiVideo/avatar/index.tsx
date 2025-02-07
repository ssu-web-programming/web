import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { css } from 'styled-components';

import { AvatarInfo, Avatars, InitAvatarInfo } from '../../../../constants/heygenTypes';
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
import { selectPageData, setPageStatus } from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Button from '../../../buttons/Button';
import ColorPicker from '../../../colorPicker';
import ImageUploader from '../../ImageUploader';
import SelectAvatar from '../component/SelectAvatar';

import * as S from './style';

interface AvatarProps {
  avatarList: Avatars[];
  setAvatarList: Dispatch<SetStateAction<Avatars[]>>;
  selectedAvatar: AvatarInfo | null;
  setSelectedAvatar: Dispatch<SetStateAction<AvatarInfo | null>>;
}

export default function Avatar({
  avatarList,
  setAvatarList,
  selectedAvatar,
  setSelectedAvatar
}: AvatarProps) {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.aiVideo));
  const [avatarStyle, setAvatarStyle] = useState<'circle' | 'square'>('square');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedAvatar && avatarList.length > 0) {
      console.log('set');
      setSelectedAvatar((prev) =>
        prev
          ? { ...prev, avatar: avatarList[0] }
          : {
              ...InitAvatarInfo,
              avatar: avatarList[0]
            }
      );
    }
  }, [avatarList]);

  const handleImageClick = (avatar: Avatars) => {
    setSelectedAvatar((prev) => (prev ? { ...prev, avatar } : null));
    setAvatarList(
      avatar
        ? [avatar, ...avatarList.filter((item) => item.avatar_id !== avatar.avatar_id)]
        : avatarList
    );
  };

  const getShapeIcon = (shape: 'circle' | 'square') => {
    const isSelected = avatarStyle === shape;
    return isLightMode
      ? isSelected
        ? shape === 'square'
          ? SqureSelectedLightIcon
          : CircleSelectedLightIcon
        : shape === 'square'
          ? SqureLightIcon
          : CircleLightIcon
      : isSelected
        ? shape === 'square'
          ? SqureSelectedDarkIcon
          : CircleSelectedDarkIcon
        : shape === 'square'
          ? SqureDarkIcon
          : CircleDarkIcon;
  };

  const handleUploadedImage = () => {
    if (currentFile) {
      console.log(currentFile);
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'avatar' }));
    }
  };

  return (
    <>
      <S.Container>
        <S.AvatarCard isCircle={avatarStyle === 'circle'}>
          <ColorPicker
            cssExt={css`
              position: absolute;
              top: 12px;
              right: 12px;
            `}
          />
          <S.PreviewWrap isCircle={avatarStyle === 'circle'}>
            <img src={selectedAvatar?.avatar.preview_image_url} alt="preview_img" />
          </S.PreviewWrap>
          <S.AvatarInfo>
            <span className="name">{'-'}</span>
            {/*<span className="etc">{`${selectedAvatar?.voice.language} | ${selectedAvatar?.avatar.gender}`}</span>*/}
          </S.AvatarInfo>
        </S.AvatarCard>
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
                  isSelected={selectedAvatar?.avatar.avatar_id === avatar.avatar_id}>
                  <S.OuterBorder
                    isSelected={selectedAvatar?.avatar.avatar_id === avatar.avatar_id}
                  />
                  {selectedAvatar?.avatar.avatar_id === avatar.avatar_id && (
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
              {['square', 'circle'].map((shape) => (
                <Button
                  key={shape}
                  variant="lightPurple"
                  width={85}
                  height={36}
                  selected={avatarStyle === shape}
                  cssExt={css`
                    display: flex;
                    gap: 4px;
                    font-size: 14px;
                    font-weight: 500;
                    border-radius: 8px;
                    padding: 6px 8px;
                  `}
                  onClick={() => setAvatarStyle(shape as 'circle' | 'square')}>
                  <img src={getShapeIcon(shape as 'circle' | 'square')} alt={shape} />
                  <span>{shape === 'square' ? '사각형' : '원형'}</span>
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
          onClick={() => {}}>
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
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
        />
      )}
    </>
  );
}
