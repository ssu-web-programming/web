import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import * as React from 'react';
import { css } from 'styled-components';

import { AvatarInfo } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import CreditColorIcon from '../../../../img/light/ico_credit_color.svg';
import {
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Button from '../../../buttons/Button';
import AvatarCard from '../component/AvatarCard';

import * as S from './style';

export default function Script() {
  const dispatch = useAppDispatch();
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
      <AvatarCard />
      <S.VoiceContainer>
        <S.TitleWrap>
          <span className="title">스크립트 추가</span>
        </S.TitleWrap>
        <S.TextWrap isActive={isEnabled}>
          <S.TextArea
            maxLength={400}
            placeholder={'아바타가 이야기해 주었으면 하는 스크립트를 이곳에 작성 해 보세요'}
            onChange={handleChange}
            value={text}
            isEnabled={isEnabled}
          />
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
        <span>{'AI 비디오 만들기'}</span>
        <S.CreditInfo>
          <img src={CreditColorIcon} alt="credit" />
          <span>10</span>
        </S.CreditInfo>
      </Button>
    </S.Container>
  );
}
