import React, { useEffect, useRef, useState } from 'react';
import NovaLogoDarkIcon from 'img/dark/nova/ico_logo_nova_with_text.svg';
import NovaLogoLightIcon from 'img/light/nova/ico_logo_nova_with_text.svg';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import { useParams } from 'react-router-dom';
import { css } from 'styled-components';

import { NOVA_GET_SHARE_CHAT } from '../../../api/constant';
import Button from '../../../components/buttons/Button';
import Icon from '../../../components/Icon';
import { getFileIcon } from '../../../components/nova/inputBar';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { getChatGroupKey, getServiceGroupInfo, SERVICE_TYPE } from '../../../constants/serviceType';
import ArrowRightIcon from '../../../img/common/ico_arrow_right.svg';
import NoneFileDarkIcon from '../../../img/dark/none_file.svg';
import SkeletonDarkIcon from '../../../img/dark/nova/skeleton_share.json';
import ico_user from '../../../img/light/ico_user.svg';
import NoneFileLightIcon from '../../../img/light/none_file.svg';
import ico_ai from '../../../img/light/nova/ico_ai_nova.svg';
import SkeletonLightIcon from '../../../img/light/nova/skeleton_share.json';
import { lang, langCode } from '../../../locale';
import { themeInfoSelector } from '../../../store/slices/theme';
import { useAppSelector } from '../../../store/store';

import * as S from './style';
import { ChatMode, DateWithGuide, LogoWrap } from './style';

type NovaChatType = {
  type: string;
  content: string;
  files?: string[];
  llm: SERVICE_TYPE;
};

interface IShareType {
  list: NovaChatType[];
  mainLlm: SERVICE_TYPE;
}

export default function ShareChat() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const [data, setData] = useState<IShareType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastChatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getShareChat();
  }, []);

  useEffect(() => {
    // if (isLoading) return;
    //
    // observerRef.current = new IntersectionObserver(
    //   ([entry]) => {
    //     if (entry.isIntersecting) {
    //       getShareChat();
    //     }
    //   },
    //   { threshold: 0.5 }
    // );
    //
    // if (lastChatRef.current) {
    //   observerRef.current.observe(lastChatRef.current);
    // }
    //
    // return () => observerRef.current?.disconnect();
  }, [isLoading]);

  const getShareChat = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_PO_PUBLIC_API}${NOVA_GET_SHARE_CHAT}`, {
        method: 'POST',
        body: JSON.stringify({
          shareId: id,
          page: 1,
          pageCount: 1
        })
      });
      setData(await res.json());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (locale: string): string => {
    const now = new Date();
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(now);
  };

  return (
    <S.Wrapper ref={lastChatRef}>
      {data ? (
        <>
          <S.Header>
            <S.LogoWrap>
              <img
                src={isLightMode ? NovaLogoLightIcon : NovaLogoDarkIcon}
                alt="logo"
                width={107}
                height={32}
              />
              <S.ChatMode>
                <span>
                  {data.mainLlm === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
                    ? 'Perplexity R-Pro'
                    : getServiceGroupInfo(getChatGroupKey(data.mainLlm) || '', isLightMode).label}
                </span>
              </S.ChatMode>
            </S.LogoWrap>
            <DateWithGuide>
              <span className="date">{formatDate(langCode)}</span>
              <span className="guide">{t(`Nova.aiChat.ShareChat.ExpiryDate`)}</span>
            </DateWithGuide>
          </S.Header>
          <S.Content>
            {data.list?.map((item, index) => (
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
                  {item.type === 'answer' && data.mainLlm != item.llm && (
                    <S.ChatMode>
                      <span>
                        {item.llm === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
                          ? 'Perplexity R-Pro'
                          : getServiceGroupInfo(getChatGroupKey(item.llm) || '', isLightMode).label}
                      </span>
                    </S.ChatMode>
                  )}
                </S.Detail>
              </S.Message>
            ))}
          </S.Content>
        </>
      ) : (
        <S.EmptyWrapper>
          <img
            src={isLightMode ? NovaLogoLightIcon : NovaLogoDarkIcon}
            alt="logo"
            width={107}
            height={40}
          />
          {isLoading ? (
            <Lottie animationData={isLightMode ? SkeletonLightIcon : SkeletonDarkIcon} loop play />
          ) : (
            <S.EmptyBox>
              <img src={isLightMode ? NoneFileLightIcon : NoneFileDarkIcon} alt="none-file" />
              <span>{t(`Nova.aiChat.ShareChat.NotValidPage`)}</span>
            </S.EmptyBox>
          )}
          <Button
            variant="purple"
            width={328}
            height={48}
            onClick={() => {
              window.open(`https://www.polarisoffice.com/${lang}`, '_blank', 'noopener,noreferrer');
            }}
            cssExt={css``}>
            {t(`Nova.aiChat.ShareChat.MovePOPage`)}
            <img src={ArrowRightIcon} alt="arrow-left" />
          </Button>
        </S.EmptyWrapper>
      )}
    </S.Wrapper>
  );
}
