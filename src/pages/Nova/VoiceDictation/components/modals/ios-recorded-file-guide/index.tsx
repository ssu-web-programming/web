import { overlay } from 'overlay-kit';

import * as S from './style';

interface Props {
  onConfirm: () => void;
  onCancle?: () => void;
  title: string;
  subTitle: string;
  closeTxt?: string;
  confirmTxt?: string;
}

export default function IosRecordedFileGuide({
  onConfirm,
  onCancle,
  title,
  subTitle,
  closeTxt = '취소',
  confirmTxt = '종료하기'
}: Props) {
  const handleCancle = () => {
    overlay.closeAll();
    // onCancle && onCancle();
  };

  const handleClose = () => {
    // overlay.closeAll(); // 모달을 먼저 닫고
    console.log('123123');
    onConfirm(); // 그 다음 콜백 실행
  };

  return (
    <S.ModalContainer>
      <S.Title>{title}</S.Title>
      <S.SubTitle>{subTitle}</S.SubTitle>
      <S.ButtonGroup>
        <S.Button onClick={handleCancle}>{closeTxt}</S.Button>
        <S.Button primary onClick={handleClose}>
          {confirmTxt}
        </S.Button>
      </S.ButtonGroup>
    </S.ModalContainer>
  );
}
