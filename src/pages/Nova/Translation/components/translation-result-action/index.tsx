import { ReactComponent as CopyIcon } from 'img/light/nova/translation/copy.svg';
import { ReactComponent as InsertDocIcon } from 'img/light/nova/translation/insert_docs.svg';

import * as S from './style';

interface Props {
  translatedLang: string;
  isCopyAction?: boolean;
  isInsertDocAction?: boolean;
  value: string;
}

export default function TranslationResultAction({
  translatedLang = '한국어',
  isCopyAction = true,
  isInsertDocAction = false,
  value
}: Props) {
  return (
    <S.Wrapper>
      <S.Header>
        <p>{translatedLang}</p>
        <S.IconWrapper>
          <div>{isInsertDocAction && <InsertDocIcon />}</div>
          <div>{isCopyAction && <CopyIcon />}</div>
        </S.IconWrapper>
      </S.Header>

      <S.TextArea value={value} />
    </S.Wrapper>
  );
}
