import { ChangeEvent, useEffect, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import InfoDarkIcon from '../../../../img/dark/ico_circle_info.svg';
import InfoLightIcon from '../../../../img/light/ico_circle_info.svg';
import CreditColorIcon from '../../../../img/light/ico_credit_color.svg';
import {
  selectPageResult,
  selectPageStatus,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import ArrowTooltips from '../../../ArrowTooltip';
import Button from '../../../buttons/Button';
import AvatarCard from '../component/AvatarCard';
import HeygenLogo from '../component/HeygenLogo';

import * as S from './style';

export default function Script() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));

  const defaultText = result?.info?.selectedAvatar?.input_text || '';
  const [text, setText] = useState(defaultText);
  const [isEnabled, setIsEnabled] = useState(defaultText.length > 0);

  const isScriptStep = status === 'script';

  useEffect(() => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'script' }));
  }, [result?.info.script]);

  useEffect(() => {
    return () => {
      selectAvatarScript();
    };
  }, [text]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    if (newText.length <= 100) {
      setText(newText);
      setIsEnabled(newText.length > 0);
    }
  };

  const selectAvatarScript = () => {
    if (!result?.info?.selectedAvatar) return;

    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            ...result?.info,
            selectedAvatar: {
              ...result.info.selectedAvatar,
              input_text: text
            }
          }
        }
      })
    );
  };

  const handlePrevClick = () => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'voice' }));
  };

  return (
    <>
      <S.Container>
        <AvatarCard isHideColorPicker={true} isScriptStep={isScriptStep} />
        <S.VoiceContainer>
          <S.TitleWrap>
            <span className="title">{t('Nova.aiVideo.addScript.title') || '대본 작성'}</span>
            <ArrowTooltips message={t('Nova.aiVideo.tooltip.addScript')} placement="top-start">
              <img src={isLightMode ? InfoLightIcon : InfoDarkIcon} alt="info" />
            </ArrowTooltips>
          </S.TitleWrap>
          <S.TextWrap>
            <S.TextArea
              placeholder={t('Nova.aiVideo.addScript.textAreaPlaceHolder') || ''}
              onChange={handleChange}
              value={text}
              isEnabled={isEnabled}
            />
            <div className="length-wrapper">
              <span className="length">{text.length}/100</span>
            </div>
          </S.TextWrap>
        </S.VoiceContainer>
        <S.ButtonGroup>
          <Button
            variant="white"
            width={'full'}
            height={48}
            cssExt={css`
              display: flex;
              gap: 4px;
              font-size: 16px;
              font-weight: 500;
              border-radius: 8px;
              border: 1px solid var(--gray-gray-30);
            `}
            onClick={handlePrevClick}>
            <span>{t('Nova.aiVideo.button.prev') || '이전'}</span>
          </Button>
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
              selectAvatarScript();
            }}>
            <span>{t('Nova.aiVideo.button.generate') || '생성하기'}</span>
            <S.CreditInfo>
              <img src={CreditColorIcon} alt="credit" />
              <span>50</span>
            </S.CreditInfo>
          </Button>
        </S.ButtonGroup>
        <HeygenLogo />
      </S.Container>
    </>
  );
}
