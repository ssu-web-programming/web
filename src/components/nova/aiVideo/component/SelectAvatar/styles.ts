import { Tabs } from '@mui/material';
import styled from 'styled-components';

export const Container = styled.div<{
  $isMobile: boolean;
  $isMin: boolean;
}>`
  max-width: ${({ $isMobile, $isMin }) => ($isMobile ? '100%' : $isMin ? '340px' : '420px')};
  height: ${({ $isMobile, $isMin }) => ($isMobile ? '100%' : $isMin ? '333px' : '620px')};
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: ${({ theme }) => theme.color.background.gray05};
  z-index: 100;
  box-shadow: 0 8px 16px 0 #0000001a;
  border-radius: 16px;
`;

export const TitleWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.gray01};

  img {
    width: 28px;
    height: 28px;
  }
`;

export const AvartarContainer = styled.div<{ isSelected: boolean }>`
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
  border-radius: 6px;
  pointer-events: none;
  z-index: 1;
`;

export const Image = styled.img`
  width: 76px;
  height: 76px;
  border: 1.27px solid #e8ebed;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
`;

export const CheckBox = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 1px;
  left: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6f3ad0;
  border-bottom-right-radius: 8px;
`;
export const CustomTabs = styled(Tabs)`
  width: 100%;

  .MuiTabs-flexContainer {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow-x: hidden;
  }

  .MuiTab-root {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    font-family: Pretendard, sans-serif;
    color: ${({ theme }) => theme.color.text.gray07} !important;
  }

  .Mui-selected {
    color: ${({ theme }) => theme.color.text.highlight03} !important;
  }

  .MuiTabs-indicator {
    background-color: ${({ theme }) => theme.color.text.highlight03} !important;
  }
`;

export const ListWrap = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px 12px 0 12px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.color.background.bg};

  img {
    width: 100px;
    height: 100px;
    border: 1px solid ${({ theme }) => theme.color.border.gray05};
    border-radius: 5.57px;
  }
`;

export const ButtonWrap = styled.div`
  width: 100%;
  padding: 16px;
`;
