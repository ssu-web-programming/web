import { useState } from 'react';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';

import * as S from './style';

interface Props {
  onSave: (type: 'txt' | 'pdf') => Promise<void>;
}

export default function VoiceFileModalContent({ onSave }: Props) {
  const [fileType, setFileType] = useState<'txt' | 'pdf'>('txt'); // 기본값을 'txt'로 설정
  const { t } = useTranslation();
  const handleClose = () => {
    overlay.closeAll();
  };

  const handleSave = async () => {
    handleClose();
    await onSave(fileType);
  };

  return (
    <S.ModalContainer>
      <S.ModalTitle>{t('Nova.voiceDictation.Alert.FileFormatSelection')}</S.ModalTitle>

      <S.RadioGroup>
        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="fileFormat"
            value="txt"
            checked={fileType === 'txt'}
            onChange={(e) => setFileType(e.target.value as 'txt' | 'pdf')}
          />
          <S.RadioText>{t('Nova.voiceDictation.FileFormat.Options.Text')}</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="fileFormat"
            value="pdf"
            checked={fileType === 'pdf'}
            onChange={(e) => setFileType(e.target.value as 'txt' | 'pdf')}
          />
          <S.RadioText>{t('Nova.voiceDictation.FileFormat.Options.Pdf')}</S.RadioText>
        </S.RadioLabel>
      </S.RadioGroup>

      <S.ButtonGroup>
        <S.Button onClick={handleClose}>{t('Nova.voiceDictation.Button.Cancel')}</S.Button>
        <S.Button primary onClick={handleSave}>
          {t('Nova.voiceDictation.Button.Save')}
        </S.Button>
      </S.ButtonGroup>
    </S.ModalContainer>
  );
}
