import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
`;

export const AvartarContainer = styled.div<{ isSelected: boolean }>`
  width: 100%;
  aspect-ratio: 1;
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
  border: 2px solid
    ${({ isSelected, theme }) =>
      isSelected ? theme.color.border.purple02 : theme.color.border.gray01};
  border-radius: 6px;
  pointer-events: none;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.color.border.gray02};
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
`;

// 피그마 스타일 컴포넌트 추가
export const AvatarSelectionContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AvatarPreview = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
`;

export const AvatarSelectionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-radius: 8px;
  padding: 0;
  min-height: 328px;
  max-height: 328px;
  background-color: ${({ theme }) => theme.color.background.white};
  overflow: hidden;
`;

export const AvatarFilterSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const GenderFilter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.gray05};
  background-color: ${({ theme }) => theme.color.background.gray10};
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 12px;
  padding: 2px 0;
`;

export const RadioItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RadioLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.text.gray03};
`;

export const GridContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  padding: 12px 12px 0 12px;
`;

export const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;
