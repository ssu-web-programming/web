import { useState } from 'react';
import ButtonWithCredit from 'components/buttons/button-with-credit';
import { ReactComponent as CloseLightIcon } from 'img/light/ico_nova_close.svg';
import { useTranslation } from 'react-i18next';
import { activeToast } from 'store/slices/toastSlice';
import { useAppDispatch } from 'store/store';
import { css } from 'styled-components';
import { getLangFromLangCode } from 'util/translation';

import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import useTranslationIntro from '../../hooks/use-translation-intro';
import { useTranslationContext } from '../../provider/translation-provider';
import DragAndDrop from '../drag-and-drop';
import Toggle, { ToggleOption } from '../toggle';
import TranslationFileUploader from '../translation-file-uploader';

import * as S from './style';

type TranslateType = 'TEXT' | 'FILE';

export default function TranslationIntro() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [type, setType] = useState<TranslateType>('TEXT');
  const [translateInputValue, setTranslateInputValue] = useState('');

  const {
    sharedTranslationInfo: { sourceLang, targetLang }
  } = useTranslationContext();

  const {
    handleOpenLangSearch,
    handleSwitchLang,
    isTranslateActive,
    submitTextTranslate,
    submitFileTranslate
  } = useTranslationIntro(translateInputValue);

  const options: ToggleOption<TranslateType>[] = [
    {
      id: 'TEXT',
      label: '텍스트 번역',
      icon: <S.StyledTransTxt $isActive={type === 'TEXT'} />
    },
    { id: 'FILE', label: '파일 번역', icon: <S.StyledTransFile $isActive={type === 'FILE'} /> }
  ];

  const handleTranslate = () => {
    if (type === 'TEXT') {
      submitTextTranslate();
      return;
    }
    // File 번역일때 타는 로직!
    submitFileTranslate();
  };

  return (
    <>
      <S.ToggleWrapper>
        <Toggle<TranslateType>
          options={options}
          type={type}
          onToggle={setType}
          buttonStyle={css`
            width: 136px;
            justify-content: center;
          `}
        />
      </S.ToggleWrapper>

      <S.TextAreaWrapper>
        <S.TextAreaHeader>
          <div>
            <span>{getLangFromLangCode('source', sourceLang)}</span>
            <S.StyledArrowIcon onClick={() => handleOpenLangSearch('source')} />
          </div>
          <div>
            <S.StyledSwitch onClick={handleSwitchLang} />
          </div>
          <div>
            <span>{getLangFromLangCode('target', targetLang)}</span>
            <S.StyledArrowIcon onClick={() => handleOpenLangSearch('source')} />
          </div>
        </S.TextAreaHeader>
        {type === 'TEXT' ? (
          <S.TextInputWrapper>
            <S.TextArea
              placeholder="번역할 내용을 입력하세요."
              value={translateInputValue}
              onChange={(e) => {
                if (e.target.value.length > 10000) {
                  dispatch(
                    activeToast({ type: 'error', msg: '최대 10,000자까지만 입력이 가능합니다.' })
                  );
                }
                setTranslateInputValue(e.target.value);
              }}
              maxLength={10000}
            />
            <S.CloseIconWrapper onClick={() => setTranslateInputValue('')}>
              <CloseLightIcon width={24} height={24} />
            </S.CloseIconWrapper>
          </S.TextInputWrapper>
        ) : (
          <S.FileUploaderWrapper>
            <DragAndDrop onDrop={() => console.log('여기!')}>
              <TranslationFileUploader
                guideMsg={t('Nova.Translate.UploadGuide')}
                creditCount={20}
                curTab={NOVA_TAB_TYPE.convert2DTo3D}
              />
            </DragAndDrop>
          </S.FileUploaderWrapper>
        )}

        <S.TextAreaBottom>
          <S.StyledDeepL />
          {type === 'TEXT' && <span>{translateInputValue.length}자/10,000자</span>}
        </S.TextAreaBottom>
      </S.TextAreaWrapper>

      <ButtonWithCredit
        text="번역하기"
        isActive={translateInputValue.length > 0 || isTranslateActive}
        onClick={handleTranslate}
      />
    </>
  );
}
