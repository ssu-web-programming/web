import { ReactComponent as FileImg } from 'img/light/nova/voiceDictation/file.svg';
import { ReactComponent as Mic } from 'img/light/nova/voiceDictation/mic.svg';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0px 16px 40px;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
  color: ${({ theme }) => theme.color.text.gray03};
`;

const ItemWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;
const Item = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  background: ${({ theme }) => theme.color.background.gray10};
  height: 100px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  color: ${({ theme }) => theme.color.text.gray03};
`;

const StyledMic = styled(Mic)`
  & path {
    fill: ${({ theme }) => theme.color.text.gray03};
  }
`;
const StyledFileImg = styled(FileImg)`
  & path {
    fill: ${({ theme }) => theme.color.text.gray03};
  }

  & rect {
    fill: ${({ theme }) => theme.color.text.gray03};
  }
`;

export { Container, Item, ItemWrapper, StyledFileImg, StyledMic, Title };
