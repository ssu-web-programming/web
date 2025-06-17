import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 16px 16px 16px;
  gap: 24px;
  overflow-y: auto;
`;

export const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const ContentArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyleSectionBox = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.background.gray03};
  border: 1px solid ${({ theme }) => theme.color.border.gray02};
  border-radius: 20px;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MainTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.text.main};
`;

export const MainDesc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.text.gray06};
  text-align: center;
  white-space: break-spaces;
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.text.gray04};
  align-self: flex-start;
`;

export const StyleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  padding: 0;
`;

export const StyleItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

export const ThumbnailWrap = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OuterBorder = styled.div<{ isSelected: boolean }>`
  display: ${(props) => (props.isSelected ? 'flex' : 'none')};
  width: 100%;
  height: 100%;
  position: absolute;
  border: 2px solid #6f3ad0;
  border-radius: 12px;
  pointer-events: none;
  z-index: 1;
`;

export const InnerBorder = styled.div<{ isSelected: boolean }>`
  display: ${(props) => (props.isSelected ? 'flex' : 'none')};
  position: absolute;
  inset: 2px;
  border: 2px solid white;
  border-radius: 12px;
  pointer-events: none;
  z-index: 0;
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 12px;
  object-fit: cover;
  box-sizing: border-box;
`;

export const StyleLabel = styled.div`
  margin-top: 5.75px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const GuideText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.text.gray01};
`;

export const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  background: ${({ theme }) => theme.color.background.gray01};
  border: 1px solid ${({ theme }) => theme.color.border.gray02};
  border-radius: 20px;
  padding: 16px;
  box-sizing: border-box;
`;

export const InputTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const TextAreaWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputTextarea = styled.textarea`
  width: 100%;
  min-height: 144px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.border.gray02};
  border-radius: 12px;
  padding: 12px;
  box-sizing: border-box;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.text.gray04};
  resize: none;

  ::placeholder {
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.color.text.gray01};
  }
`;

export const InputSubGuide = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.text.gray01};

  span {
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

export const UploadBox = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.background.gray01};
  border: 1px solid ${({ theme }) => theme.color.border.gray02};
  border-radius: 20px;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const UploadedBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: ${({ theme }) => theme.color.background.gray01};
  border: 1px solid ${({ theme }) => theme.color.border.gray02};
  border-radius: 16px;
  gap: 8px;
`;

export const GuideMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 12px;
  background: ${({ theme }) => theme.color.background.red01};
  border: 1px solid ${({ theme }) => theme.color.border.red01};
  border-radius: 12px;

  span {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.color.text.gray04};
    white-space: break-spaces;
  }
`;

export const IconWrap = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.background.red02};
  border-radius: 8px;

  svg {
    width: 14px;
    height: 14px;
    path {
      fill: ${({ theme }) => theme.color.text.red01};
    }
  }
`;
