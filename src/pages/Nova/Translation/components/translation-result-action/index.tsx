import IconTextButton from 'components/buttons/IconTextButton';
import { useCopyToClipboard } from 'components/hooks/useCopyToClipboard';
import copyDarkIcon from 'img/dark/nova/translation/copy.svg';
import insertDarkDocIcon from 'img/dark/nova/translation/insert_docs.svg';
import copyIcon from 'img/light/nova/translation/copy.svg';
import insertDocIcon from 'img/light/nova/translation/insert_docs.svg';
import { useTranslation } from 'react-i18next';
import { themeInfoSelector } from 'store/slices/theme';
import { useAppSelector } from 'store/store';
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

  const ICON_BUTTON_LIST = [
    {
      name: t('Nova.Chat.InsertDoc.Title'),
      iconSrc: isLightMode ? insertDocIcon : insertDarkDocIcon,
      clickHandler: async () => {
        await insertDoc(translatedValue.replace(/\n/g, '<br>'));
      },
      isActive: isInsertDocAction
    },
    {
      name: t('Nova.Chat.Copy'),
      iconSrc: isLightMode ? copyIcon : copyDarkIcon,
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
