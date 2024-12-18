import React from 'react';
import { ReactComponent as IconLogoNova } from 'img/light/nova/ico_logo_nova.svg';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import Button from '../../../components/buttons/Button';
import Icon from '../../../components/Icon';
import { getFileIcon } from '../../../components/nova/InputBar';
import ArrowRightIcon from '../../../img/common/ico_arrow_right.svg';
import NoneFileDarkIcon from '../../../img/dark/none_file.svg';
import ico_user from '../../../img/light/ico_user.svg';
import NoneFileLightIcon from '../../../img/light/none_file.svg';
import ico_ai from '../../../img/light/nova/ico_ai_nova.svg';
import { langCode } from '../../../locale';
import { initFlagSelector } from '../../../store/slices/initFlagSlice';
import { novaShareChatSelector } from '../../../store/slices/nova/novaShareChatHistory';
import { themeInfoSelector } from '../../../store/slices/theme';
import { useAppSelector } from '../../../store/store';

import * as S from './style';
import { DateWithGuide } from './style';

export default function ShareChat() {
  const { t } = useTranslation();
  const { isInit } = useAppSelector(initFlagSelector);
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const novaShareChatHistory = useAppSelector(novaShareChatSelector);

  console.log('novaShareChatHistory: ', novaShareChatHistory);
  const formatDate = (locale: string): string => {
    const now = new Date();
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(now);
  };

  return (
    <S.Wrapper>
      {novaShareChatHistory.length > 0 ? (
        <>
          <S.Header>
            <IconLogoNova width={107} height={32} />
            <DateWithGuide>
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
        </>
      ) : (
        <S.EmptyWrapper>
          <IconLogoNova width={107} height={40} />
          <S.EmptyBox>
            <img src={isLightMode ? NoneFileLightIcon : NoneFileDarkIcon} alt="none-file" />
            <span>{t(`Nova.aiChat.ShareChat.NotValidPage`)}</span>
          </S.EmptyBox>
          <Button variant="purple" width={328} height={48} onClick={() => {}} cssExt={css``}>
            {t(`Nova.aiChat.ShareChat.MovePOPage`)}
            <img src={ArrowRightIcon} alt="arrow-left" />
          </Button>
        </S.EmptyWrapper>
      )}
    </S.Wrapper>
  );
}
