import { useState } from 'react';
import { overlay } from 'overlay-kit';

import * as S from './style';

interface Props {
  onSave: (type: 'txt' | 'pdf') => Promise<void>;
}

export default function VoiceFileModalContent({ onSave }: Props) {
  const [fileType, setFileType] = useState<'txt' | 'pdf'>('txt'); // 기본값을 'txt'로 설정

  const handleClose = () => {
    overlay.closeAll();
  };

  const handleSave = async () => {
    await onSave(fileType);
    handleClose();
  };

  return (
    <S.ModalContainer>
      <S.ModalTitle>어떤 파일 형식으로 저장할까요?</S.ModalTitle>

      <S.RadioGroup>
        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="fileFormat"
            value="txt"
            checked={fileType === 'txt'}
            onChange={(e) => setFileType(e.target.value as 'txt' | 'pdf')}
          />
          <S.RadioText>텍스트 문서(.txt)</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput
            type="radio"
            name="fileFormat"
            value="pdf"
            checked={fileType === 'pdf'}
            onChange={(e) => setFileType(e.target.value as 'txt' | 'pdf')}
          />
          <S.RadioText>pdf 문서(.pdf)</S.RadioText>
        </S.RadioLabel>
      </S.RadioGroup>

      <S.ButtonGroup>
        <S.Button onClick={handleClose}>취소</S.Button>
        <S.Button primary onClick={handleSave}>
          저장하기
        </S.Button>
      </S.ButtonGroup>
    </S.ModalContainer>
  );
}
