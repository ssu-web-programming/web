import styled from 'styled-components';

export const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 24px 12px;
  overflow: auto;
`;

export const ToolWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
  padding: 16px;
  background-color: ${({ theme }) => theme.color.background.gray01};
  border-radius: 12px;
`;

export const ToolTitle = styled.span`
  font-size: 18px;
  font-weight: 500;
  line-height: 27px;
  color: ${({ theme }) => theme.color.text.gray03};
`;

export const AIToolWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  div {
    min-width: 76px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: pointer;
  }

  img {
    width: 56px;
    height: 56px;
  }

  span {
    font-size: 13px;
    font-weight: 500;
    line-height: 19.5px;
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

export const AIImageWrap = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const ImageItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.color.border.gray02};
  border-radius: 8px;
  cursor: pointer;

  img {
    width: 100%;
    border-radius: 8px 8px 0 0;
  }

  span {
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    padding: 4px 0;
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;
