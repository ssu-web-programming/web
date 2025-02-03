import ModalSheet from 'components/modalSheet';
import { ReactComponent as File } from 'img/light/nova/voiceDictation/file.svg';
import { ReactComponent as Mic } from 'img/light/nova/voiceDictation/mic.svg';

import * as S from './style';

interface Props {
  isOpened: boolean;
  setIsOpened: (isOpen: boolean) => void;
}

export default function VoiceSaveBottomSheet({ isOpened, setIsOpened }: Props) {
  return (
    <ModalSheet isOpen={isOpened} setIsOpen={setIsOpened}>
      <S.Container>
        <S.Title>저장하기</S.Title>
        <S.ItemWrapper>
          <S.Item>
            <Mic />
            <p>음성파일</p>
          </S.Item>

          <S.Item>
            <File />
            <p>받아쓰기 파일</p>
          </S.Item>
        </S.ItemWrapper>
      </S.Container>
    </ModalSheet>
  );
}
