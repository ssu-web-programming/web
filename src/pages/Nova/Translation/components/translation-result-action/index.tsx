import IconTextButton from 'components/buttons/IconTextButton';
import { useCopyToClipboard } from 'components/hooks/useCopyToClipboard';
import copyIcon from 'img/light/nova/translation/copy.svg';
import insertDocIcon from 'img/light/nova/translation/insert_docs.svg';
import { useTranslation } from 'react-i18next';
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

  const ICON_BUTTON_LIST = [
    {
      name: t('Nova.Chat.InsertDoc.Title'),
      iconSrc: insertDocIcon,
      clickHandler: async () => {
        await insertDoc(translatedValue);
        console.log('문서에 삽입!');
      },
      isActive: isInsertDocAction
    },
    {
      name: t('Nova.Chat.Copy'),
      iconSrc: copyIcon,
      clickHandler: async () => await copyText(translatedValue),
      isActive: isCopyAction
    }
  ];

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
