import styled from 'styled-components';

export const AvatarCard = styled.div<{ isCircle: boolean }>`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;

  .logo {
    position: absolute;
    top: 12px;
    left: 12px;
  }
`;

export const AvatarContentContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const AvatarImageContainer = styled.div<{
  isCircle: boolean;
  bgColor: string;
  isSelected?: boolean;
}>`
  width: ${({ isCircle }) => (isCircle ? '180px' : '248px')};
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: ${({ isCircle }) => (isCircle ? '50%' : '12px')};
  overflow: hidden;
  background-color: ${({ bgColor }) => bgColor || '#b2c7ea'};
  border: 2px solid
    ${({ isSelected, theme }) =>
      isSelected ? theme.color.border.purple02 : theme.color.border.gray01};
  transition: all 0.3s ease;
`;

export const AvatarImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AvatarImageElement = styled.img<{ isCircle: boolean }>`
  wudth: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: ${({ isCircle }) => (isCircle ? '50%' : '12px')};
`;

export const AvatarImage = styled.div<{ isCircle: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: ${({ isCircle }) => (isCircle ? '50%' : '12px')};
`;

export const PreviewWrap = styled.div<{ isCircle: boolean; bgColor: string; isSelected?: boolean }>`
  width: ${({ isCircle }) => (isCircle ? '160px' : '100%')};
  height: ${({ isCircle }) => (isCircle ? '160px' : '100%')};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bgColor }) => bgColor};
  border-radius: ${({ isCircle }) => (isCircle ? '99px' : '12px')};
  margin-bottom: ${({ isCircle }) => (isCircle ? '30px' : '0')};
  position: relative;
  border: 2px solid
    ${({ isSelected, theme }) =>
      isSelected ? theme.color.border.purple02 : theme.color.border.gray01};

  img {
    width: ${({ isCircle }) => (isCircle ? '160px' : '100%')};
    height: ${({ isCircle }) => (isCircle ? '160px' : '100%')};
    object-fit: contain;
    border-radius: ${({ isCircle }) => (isCircle ? '99px' : '12px')};
  }
`;

export const AvatarInfo = styled.div<{ isCircle: boolean; isSelected?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: ${({ theme }) => theme.color.background.gray01};
  border-radius: 8px;
  margin-top: 8px;
  border: ${({ isSelected, theme }) =>
    isSelected
      ? `2px solid ${theme.color.border.purple02}`
      : `1px solid ${theme.color.border.gray01}`};

  .name {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

export const AvatarStyleContainer = styled.div`
  max-width: 32px;
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  z-index: 1;
`;

export const AvatarStyleSelector = styled.div`
  width: 32px;
  height: 60px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.background.gray01};
  border-radius: 8px;
  overflow: hidden;
  padding: 2px;
`;

export const AvatarStyleOption = styled.div<{ isSelected: boolean }>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
  border-radius: 6px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.background.selected : theme.color.background.gray01};
`;

export const AvatarStyleSquare = styled.div`
  width: 18px;
  height: 18px;
`;

export const AvatarStyleCircle = styled.div`
  width: 18px;
  height: 18px;
`;
