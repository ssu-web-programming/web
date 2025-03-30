import styled from 'styled-components';

export const SheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0px 16px 40px 16px;
`;

export const LanguageOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

interface LanguageItemProps {
  isSelected: boolean;
}

export const LanguageItem = styled.button<LanguageItemProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 12px;
  border: none;
  background-color: ${({ isSelected }) => (isSelected ? '#F5F1FD' : 'transparent')};
  border-radius: ${({ isSelected }) => (isSelected ? '8px' : '0')};
  cursor: pointer;
  transition: background-color 0.2s ease;
  height: 48px;

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? '#F5F1FD' : '#F7F7F7')};
  }
`;

export const LanguageText = styled.span<LanguageItemProps>`
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5em;
  letter-spacing: -0.32px;
  color: ${({ isSelected }) => (isSelected ? '#6F3AD0' : '#454C53')};
  text-align: center;
`;

export const BottomDescription = styled.p`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5em;
  letter-spacing: -0.28px;
  color: #9ea4aa;
  margin: 0;
`;
