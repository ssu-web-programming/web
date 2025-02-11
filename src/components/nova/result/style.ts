import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex: 1 1 0;
  background: ${({ theme }) => theme.color.bg};
  overflow-y: auto;
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 0 16px;
  margin: auto;
  overflow-y: auto;
`;

export const Guide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

export const Title = styled.div<{ lang: string }>`
  display: flex;
  flex-direction: ${(props) => (props.lang === 'en' ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  gap: 4px;

  span {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: ${({ theme }) => theme.color.text.gray04};
    text-align: center;
    white-space: break-spaces;
  }
`;

export const SubTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.gray05};
  text-align: center;
  white-space: break-spaces;
`;

export const ImageBox = styled.div<{ isBordered: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  max-width: 480px;
  max-height: 480px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: ${({ theme, isBordered }) => (isBordered ? theme.color.border.gray02 : 'none')};
  border-radius: 8px;
  overflow: hidden;
  height: 100%;

  img,
  video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: ${(props) => (props.isBordered ? 'none' : '8px')};
  }
`;

export const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 16px;
`;

export const RemakeButton = styled.div`
  width: 100%;
  height: 48px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border: 1px solid #c9cdd2;
  border-radius: 8px;
  cursor: pointer;
  background: white;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #454c53;
  }

  img {
    position: absolute;
    right: 12px;
  }
`;

export const DefaultButtonWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
`;
