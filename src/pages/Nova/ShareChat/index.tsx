import React from 'react';
import { ReactComponent as IconLogoNova } from 'img/light/nova/ico_logo_nova.svg';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'util/bridge';

import Icon from '../../../components/Icon';
import { getFileIcon } from '../../../components/nova/InputBar';
import ico_user from '../../../img/light/ico_user.svg';
import ico_ai from '../../../img/light/nova/ico_ai_nova.svg';
import { langCode } from '../../../locale';
import { novaShareChatSelector } from '../../../store/slices/nova/novaShareChatHistory';
import { useAppSelector } from '../../../store/store';

import * as S from './style';
import { DateWithGuide } from './style';

export default function ShareChat() {
  const { t } = useTranslation();
  const novaShareChatHistory = useAppSelector(novaShareChatSelector);

  const formatDate = (locale: string): string => {
    const now = new Date();
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(now);
  };

  return (
    <S.Wrapper $isMobile={isMobile}>
      <S.Header>
        <IconLogoNova width={107} height={32} />
        <DateWithGuide $isMobile={isMobile}>
          <span className="date">{formatDate(langCode)}</span>
          <span className="guide">{t(`Nova.aiChat.ShareChat.ExpiryDate`)}</span>
        </DateWithGuide>
      </S.Header>
      <S.Content>
        {novaShareChatHistory.map((item, index) => (
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
              {item.files?.map((file, idx) => (
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
