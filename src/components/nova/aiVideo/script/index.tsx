import { ChangeEvent, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import InfoDarkIcon from '../../../../img/dark/ico_circle_info.svg';
import HeyzenLogoDarkIcon from '../../../../img/dark/nova/logo/ico_heygen_name_logo.svg';
import InfoLightIcon from '../../../../img/light/ico_circle_info.svg';
import CreditColorIcon from '../../../../img/light/ico_credit_color.svg';
import HeyzenLogoLightIcon from '../../../../img/light/nova/logo/ico_heygen_name_logo.svg';
import {
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import ArrowTooltips from '../../../ArrowTooltip';
import Button from '../../../buttons/Button';
import AvatarCard from '../component/AvatarCard';

import * as S from './style';

export default function Script() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    if (newText.length <= 400) {
      setText(newText);
      setIsEnabled(newText.length > 0);
    }
  };

  const selectAvatarScript = (script: string) => {
    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            ...result?.info,
            selectedAvatar: {
              ...result?.info?.selectedAvatar,
              input_text: script
            }
          }
        }
      })
    );
  };

  return (
    <S.Container>
      <AvatarCard isHideColorPicker={true} />
      <S.VoiceContainer>
        <S.TitleWrap>
          <div className="wrap">
            <span className="title">{t('Nova.aiVideo.addScript.title')}</span>
            <ArrowTooltips message={t('Nova.aiVideo.tooltip.addScript')} placement="top-start">
              <img src={isLightMode ? InfoLightIcon : InfoDarkIcon} alt="info" />
            </ArrowTooltips>
          </div>
        </S.TitleWrap>
        <S.TextWrap isActive={isEnabled}>
          <S.TextArea
            maxLength={100}
            placeholder={t('Nova.aiVideo.addScript.textAreaPlaceHolder') || ''}
            onChange={handleChange}
            value={text}
            isEnabled={isEnabled}
          />
          <span className="length">{text.length}/100</span>
        </S.TextWrap>
      </S.VoiceContainer>
      <Button
        variant="purple"
        width={'full'}
        height={48}
        disable={text.length <= 0}
        cssExt={css`
          display: flex;
          gap: 4px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 8px;
          position: relative;
        `}
        onClick={() => {
          dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'loading' }));
          selectAvatarScript(text);
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
  );
}
