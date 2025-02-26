import { ReactComponent as IcDelete } from 'img/light/nova/translation/input_delete.svg';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
`;

const IconContainer = styled.div`
  position: relative; /* 이 컨테이너를 기준으로 삭제 아이콘 배치 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FileName = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.color.text.gray03};
  margin-top: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`;

const DeleteIcon = styled(IcDelete)`
  position: absolute;
  top: -6px;
  right: -6px; /* 아이콘 컨테이너 기준 오른쪽 상단 */
  cursor: pointer;
  z-index: 1;
`;

export { DeleteIcon, FileName, IconContainer, Wrapper };
