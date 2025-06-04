import styled from 'styled-components';

export const Body = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 16px;
  overflow: auto;
`;

export const ToolWrap = styled.div<{ isImage: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ isImage }) => (isImage ? '12px' : '4px')};
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
  gap: 8px;

  div {
    flex: 1;
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
    height: 49px;
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
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(93px, auto));
  gap: 8px;
`;

export const ImageItemWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const ImageItem = styled.div<{ isHighlight: boolean }>`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${({ isHighlight, theme }) => (isHighlight ? 'transparent' : theme.color.border.gray02)};
  border-radius: 8px;
  cursor: pointer;

  img {
    width: 100%;
    border-radius: 8px 8px 0 0;
  }

  span.title {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Pretendard, sans-serif;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    text-transform: none;
    padding: 4px 0;
    background-color: ${({ theme }) => theme.color.background.gray01};
    color: ${({ theme }) => theme.color.text.gray03};
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

export const HighlightWrap = styled.div<{ isHighlight: boolean }>`
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  position: absolute;
  top: -1px;
  left: -1px;
  display: ${({ isHighlight }) => (isHighlight ? 'flex' : 'none')};
  padding: 2px;
  border-radius: 8px;
  background: ${({ isHighlight }) =>
    isHighlight ? 'linear-gradient(to right, #7ec0ff, #d79bff)' : 'transparent'};
  box-shadow: 0 0 4px 0 #a072ff;
`;
