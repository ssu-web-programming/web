import { useEffect, useState } from 'react';
import IconTextButton from 'components/buttons/IconTextButton';
import { useConfirm } from 'components/Confirm';
import { useCopyToClipboard } from 'components/hooks/useCopyToClipboard';
import copyDarkIcon from 'img/dark/nova/translation/copy.svg';
import insertDarkDocIcon from 'img/dark/nova/translation/insert_docs.svg';
import copyIcon from 'img/light/nova/translation/copy.svg';
import insertDocIcon from 'img/light/nova/translation/insert_docs.svg';
import { ClientStatusType } from 'pages/Nova/Nova';
import { useTranslation } from 'react-i18next';
import { themeInfoSelector } from 'store/slices/theme';
import { useAppSelector } from 'store/store';
import Bridge from 'util/bridge';
import { insertDoc } from 'util/common';

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
  const [clientStatus, setClientStatus] = useState<ClientStatusType>('doc_edit_mode');

  const confirm = useConfirm();
  const shouldShowInsertDocButton = isInsertDocAction && clientStatus !== 'home';
  const ICON_BUTTON_LIST = [
    {
      name: t('Nova.Chat.InsertDoc.Title'),
      iconSrc: isLightMode ? insertDocIcon : insertDarkDocIcon,
      clickHandler: async () => {
        if (clientStatus === 'doc_view_mode') {
          confirm({
            title: t(`Nova.Chat.InsertDoc.Fail.Title`)!,
            msg: t(`Nova.Chat.InsertDoc.Fail.Msg.Translation`)!,
            onOk: {
              text: t(`Confirm`),
              callback: () => {}
            }
          });
        } else {
          // status가 doc_view_mode가 아닐 때만 insertDoc 실행
          await insertDoc(translatedValue.replace(/\n/g, '<br>'));
        }
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
    Bridge.callSyncBridgeApiWithCallback({
      api: 'getClientStatus',
      callback: async (status: ClientStatusType) => {
        setClientStatus(status);
      }
    });
  }, []);

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
