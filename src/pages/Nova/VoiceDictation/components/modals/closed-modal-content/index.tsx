import { overlay } from 'overlay-kit';
import { setIsClosedNovaState } from 'store/slices/appState';
import { useAppDispatch } from 'store/store';
import Bridge from 'util/bridge';

import * as S from './style';

export default function ClosedModalContent() {
  const dispatch = useAppDispatch();

  const handleCancle = () => {
    overlay.closeAll();
    dispatch(setIsClosedNovaState(false));
  };

  const handleClose = () => {
    overlay.closeAll();
    Bridge.callBridgeApi('closeNova');
    dispatch(setIsClosedNovaState(false));
  };

  return (
    <>
      <S.ModalContainer>
        <S.SubTitle>
          잠깐! 녹음을 끝내지 않고 종료하면 녹음이 저장되지 않아요. 그래도 종료하시겠어요?
        </S.SubTitle>
        <S.ButtonGroup>
          <S.Button onClick={handleCancle}>취소</S.Button>
          <S.Button primary onClick={handleClose}>
            종료하기
          </S.Button>
        </S.ButtonGroup>
      </S.ModalContainer>
    </>
  );
}
