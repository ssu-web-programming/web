import { overlay } from 'overlay-kit';

import * as S from './style';

export default function VoiceFileModalContent() {
  const handleClose = () => {
    overlay.closeAll();
  };

  return (
    <S.ModalContainer>
      <S.ModalTitle>어떤 파일 형식으로 저장할까요?</S.ModalTitle>

      <S.RadioGroup>
        <S.RadioLabel>
          <S.RadioInput name="fileFormat" defaultChecked />
          <S.RadioText>Word 문서(.docx)</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput name="fileFormat" />
          <S.RadioText>한글 문서(.hwp)</S.RadioText>
        </S.RadioLabel>

        <S.RadioLabel>
          <S.RadioInput name="fileFormat" />
          <S.RadioText>pdf 문서(.pdf)</S.RadioText>
        </S.RadioLabel>
      </S.RadioGroup>

      <S.ButtonGroup>
        <S.Button onClick={handleClose}>취소</S.Button>
        <S.Button primary>저장하기</S.Button>
      </S.ButtonGroup>
    </S.ModalContainer>
  );
}
