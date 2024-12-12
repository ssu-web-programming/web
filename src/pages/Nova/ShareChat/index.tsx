import React from 'react';
import { ReactComponent as IconLogoNova } from 'img/light/nova/ico_logo_nova.svg';
import { marked } from 'marked';
import { isMobile } from 'util/bridge';

import Icon from '../../../components/Icon';
import { getFileIcon } from '../../../components/nova/InputBar';
import ico_ai from '../../../img/light/ico_ai.svg';
import ico_user from '../../../img/light/ico_user.svg';

import data from './chat_history.json';
import * as S from './style';
import { DateWithGuide } from './style';

export default function ShareChat() {
  return (
    <S.Wrapper $isMobile={isMobile}>
      <S.Header>
        <IconLogoNova width={107} height={32} />
        <DateWithGuide $isMobile={isMobile}>
          <span className="date">2024년 11월 29일</span>
          <span className="guide">※ 본 링크는 7일 간만 유효합니다.</span>
        </DateWithGuide>
      </S.Header>
      <S.Content>
        {data.map((item, index) => (
          <S.Message key={index}>
            <p>
              <strong>
                {item.type === 'question' ? (
                  <Icon size={32} iconSrc={ico_user}></Icon>
                ) : (
                  <Icon size={32} iconSrc={ico_ai}></Icon>
                )}
              </strong>
            </p>

            <S.Detail>
              <div dangerouslySetInnerHTML={{ __html: marked(item.content) }} />
              {item.files.map((file, idx) => (
                <S.FileItem key={idx}>
                  <Icon size={28} iconSrc={getFileIcon(file)} />
                  {file}
                </S.FileItem>
              ))}
            </S.Detail>
          </S.Message>
        ))}
      </S.Content>
    </S.Wrapper>
  );
}
