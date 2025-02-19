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
  color: ${({ theme }) => theme.color.text.gray04};

  img {
    width: 28px;
    height: 28px;
  }
`;

export const SelectBoxWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  padding: 12px 16px;
`;

export const VoiceContainer = styled.div<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

export const VoiceInfoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  .radio {
    width: 32px;
    height: 32px;
  }

  .name {
    font-size: 14px;
    font-weight: 700;
    line-height: 21px;
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

export const VoiceInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IdentifyWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;

  img {
    width: 24px;
  }

  span {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.color.text.gray07};
  }
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

export const ListWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.color.background.bg};
`;

export const ButtonWrap = styled.div`
  width: 100%;
  padding: 16px;
`;
