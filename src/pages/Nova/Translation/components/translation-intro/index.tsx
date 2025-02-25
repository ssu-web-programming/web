import { useEffect, useState } from 'react';
import ButtonWithCredit from 'components/buttons/button-with-credit';
import { useConfirm } from 'components/Confirm';
import { ReactComponent as CloseLightIcon } from 'img/light/ico_nova_close.svg';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { activeToast } from 'store/slices/toastSlice';
import { setDriveFiles } from 'store/slices/uploadFiles';
import { useAppDispatch } from 'store/store';
import { css } from 'styled-components';
import { getLangFromLangCode } from 'util/translation';

import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import useTranslationIntro from '../../hooks/use-translation-intro';
import { useTranslationContext } from '../../provider/translation-provider';
import Toggle, { ToggleOption } from '../toggle';
import TranslationFileUploader from '../translation-file-uploader';

import * as S from './style';

export type TranslateType = 'TEXT' | 'FILE';

export default function TranslationIntro() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const [type, setType] = useState<TranslateType>('TEXT');
  const [translateInputValue, setTranslateInputValue] = useState('');
  const location = useLocation();

  const {
    sharedTranslationInfo: { sourceLang, targetLang }
  } = useTranslationContext();

  const {
    handleOpenLangSearch,
    handleSwitchLang,
    isTranslateActive,
    submitTextTranslate,
    submitFileTranslate
  } = useTranslationIntro(translateInputValue, type);

  const options: ToggleOption<TranslateType>[] = [
    {
      id: 'TEXT',
      label: t('Nova.translation.Button.TextTranslation'),
      icon: <S.StyledTransTxt $isActive={type === 'TEXT'} />
    },
    {
      id: 'FILE',
      label: t('Nova.translation.Button.FileTranslation'),
      icon: <S.StyledTransFile $isActive={type === 'FILE'} />
    }
  ];

  const validateLang = () => {
    if (sourceLang === targetLang) {
      confirm({
        msg: t('Nova.translation.Guide.SameLanguage'),
        onOk: {
          text: t('Confirm')
        }
      });
    }
  };

  const handleTranslate = () => {
    if (type === 'TEXT') {
      submitTextTranslate();
      return;
    }
    // File 번역일때 타는 로직!
    submitFileTranslate();
  };

  useEffect(() => {
    validateLang();
  }, [sourceLang, targetLang]);

  useEffect(() => {
    if (location.state?.body) {
      console.log('location.state', location.state);
      setTranslateInputValue(location.state.body.inputText);
    }
  }, [location.state?.body]);

  useEffect(() => {
    if (type === 'TEXT') {
      dispatch(setDriveFiles([]));
    } else if (type === 'FILE') {
      setTranslateInputValue('');
    }
  }, [type]);

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
            <S.StyledArrowIcon onClick={() => handleOpenLangSearch('target')} />
          </div>
        </S.TextAreaHeader>
        {type === 'TEXT' ? (
          <S.TextInputWrapper>
            <S.TextArea
              placeholder={t('Nova.translation.Input.Placeholder') as string}
              value={translateInputValue}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length > 10000) {
                  dispatch(
                    activeToast({ type: 'error', msg: t('Nova.translation.Guide.MaxCharacters') })
                  );
                  setTranslateInputValue(newValue.slice(0, 10000));
                  return;
                }
                setTranslateInputValue(newValue);
              }}
            />
            <S.CloseIconWrapper onClick={() => setTranslateInputValue('')}>
              <CloseLightIcon width={24} height={24} />
            </S.CloseIconWrapper>
          </S.TextInputWrapper>
        ) : (
          <S.FileUploaderWrapper>
            <TranslationFileUploader
              guideMsg={t('Nova.Translate.UploadGuide')}
              creditCount={100}
              curTab={NOVA_TAB_TYPE.translation}
            />
          </S.FileUploaderWrapper>
        )}

        <S.TextAreaBottom>
          <S.StyledDeepL />
          {type === 'TEXT' && (
            <span>{`${translateInputValue.length.toLocaleString()}${t('Nova.translation.Input.CharacterCount')}`}</span>
          )}
        </S.TextAreaBottom>
      </S.TextAreaWrapper>

      <ButtonWithCredit
        text={t('Nova.translation.Button.Translate')}
        isActive={
          (translateInputValue.length > 0 || isTranslateActive) && sourceLang !== targetLang
        }
        onClick={handleTranslate}
        creditAmount={type === 'TEXT' ? 20 : 100}
      />
    </>
  );
}
