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

export const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const AvatarSelectBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const TitleWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title,
  .show {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.gray04};
  }

  .show {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    cursor: pointer;
  }
`;

export const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const AvartarList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 76px);
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  box-sizing: border-box;
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

export const RadioButton = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid
    ${({ checked, theme }) => (checked ? theme.color.border.purple01 : theme.color.border.gray01)};
  background-color: ${({ checked, theme }) =>
    checked ? theme.color.background.purple01 : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  &:after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.background.white};
    display: ${({ checked }) => (checked ? 'block' : 'none')};
  }
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

export const GridItem = styled.div`
  flex: 1;
  aspect-ratio: 1;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.color.background.gray01};
  cursor: pointer;

  &:hover {
    border: 1px solid ${({ theme }) => theme.color.border.purple01};
  }
`;

export const LoadingMessage = styled.div`
  width: 100%;
  text-align: center;
  padding: 8px 0;
  color: ${({ theme }) => theme.color.text.gray07};
  font-size: 14px;
  font-weight: 500;
  grid-column: 1 / span 4;
`;

export const SkeletonWrap = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  grid-column: 1 / span 4;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;
