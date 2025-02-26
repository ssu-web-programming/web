import { useCallback, useEffect, useState } from 'react';
import IconTextButton from 'components/buttons/IconTextButton';
import { useConfirm } from 'components/Confirm';
import { useInsertDocsHandler } from 'components/hooks/nova/useInsertDocsHandler';
import { useCopyToClipboard } from 'components/hooks/useCopyToClipboard';
import copyDarkIcon from 'img/dark/nova/translation/copy.svg';
import insertDarkDocIcon from 'img/dark/nova/translation/insert_docs.svg';
import copyIcon from 'img/light/nova/translation/copy.svg';
import insertDocIcon from 'img/light/nova/translation/insert_docs.svg';
import { ClientStatusType } from 'pages/Nova/Nova';
import { useTranslation } from 'react-i18next';
import { NovaChatType } from 'store/slices/nova/novaHistorySlice';
import { themeInfoSelector } from 'store/slices/theme';
import { useAppSelector } from 'store/store';
import Bridge from 'util/bridge';

import * as S from './style';

interface Props {
  translatedLang?: string;
  isCopyAction?: boolean;
  isInsertDocAction?: boolean;
  translatedValue: string;
}

export default function TranslationResultAction({
  translatedLang = '한국어',
  isCopyAction = true,
  isInsertDocAction = false,
  translatedValue
}: Props) {
  const { t } = useTranslation();
  const { copyText } = useCopyToClipboard();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { insertDocsHandler } = useInsertDocsHandler();
  const [clientStatus, setClientStatus] = useState<ClientStatusType>('doc_edit_mode');

  const shouldShowInsertDocButton = isInsertDocAction && clientStatus !== 'home';

  const updateClientStatus = useCallback(() => {
    Bridge.callSyncBridgeApiWithCallback({
      api: 'getClientStatus',
      callback: async (status: ClientStatusType) => {
        setClientStatus(status);
      }
    });
  }, []);

  // 번역 결과를 NovaChatType 형태로 변환하는 함수
  const createTranslationHistory = (): Partial<NovaChatType> => {
    return {
      askType: 'document',
      output: translatedValue.replace(/\n/g, '<br>')
    };
  };

  const ICON_BUTTON_LIST = [
    {
      name: t('Nova.Chat.InsertDoc.Title'),
      iconSrc: isLightMode ? insertDocIcon : insertDarkDocIcon,
      clickHandler: async () => {
        // useInsertDocsHandler의 insertDocsHandler 사용
        const translationHistory = createTranslationHistory();
        await insertDocsHandler(translationHistory as NovaChatType);
      },
      isActive: shouldShowInsertDocButton
    },
    {
      name: t('Nova.Chat.Copy'),
      iconSrc: isLightMode ? copyIcon : copyDarkIcon,
      clickHandler: async () => await copyText(translatedValue),
      isActive: isCopyAction
    }
  ];

  useEffect(() => {
    updateClientStatus();
  }, [updateClientStatus]);

  return (
    <S.Wrapper>
      <S.Header>
        <p>{translatedLang}</p>
        <S.IconWrapper>
          {ICON_BUTTON_LIST.filter((iconButton) => iconButton.isActive).map((iconButton) => (
            <IconTextButton
              key={iconButton.name}
              onClick={iconButton.clickHandler}
              tooltip={iconButton.name}
              iconSrc={iconButton.iconSrc}
              iconSize={24}
              width={'fit'}
            />
          ))}
        </S.IconWrapper>
      </S.Header>

      <S.TextArea value={translatedValue} readOnly />
    </S.Wrapper>
  );
}
