import { HexColorPicker } from 'react-colorful';
import styled from 'styled-components';

export const Container = styled.div`
  width: calc(100% - 16px);
  height: fit-content;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 36px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  padding: 24px;
  background-color: ${({ theme }) => theme.color.background.gray05};
  z-index: 100;
  box-shadow: 0 8px 16px 0 #0000001a;
  border-radius: 16px;
  overflow-y: auto;
`;

export const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Title = styled.span`
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  color: ${({ theme }) => theme.color.text.gray04};
  text-transform: none;
`;

export const ColorPickerWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const ColorPicker = styled(HexColorPicker)`
  &.react-colorful {
    width: 100%;
    height: fit-content;
    gap: 25px;
  }

  .react-colorful__saturation {
    height: 200px;
    border-radius: 8px;
  }

  .react-colorful__last-control {
    height: 20px;
    border-radius: 99px;
    border: 1px solid
      ${({ theme }) => (theme.isLightMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')};
  }

  .react-colorful__saturation-pointer {
    width: 20px;
    height: 20px;
    border: 1px solid var(--gray-gray-30);
  }

  .react-colorful__hue-pointer {
    width: 18px !important;
    height: 18px !important;
    border-width: 4px;
  }

  .react-colorful__pointer {
    width: 20px;
    height: 20px;
  }
`;

export const ColorPickerInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const CurrentColor = styled.div<{ color: string }>`
  width: 60px;
  height: 40px;
  border: 1px solid
    ${({ theme }) => (theme.isLightMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')};
  border-radius: 8px;
  background-color: ${({ color }) => color};
`;

export const PresetWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;

export const Preset = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-radius: 99px;
  background-color: ${({ color }) => color};
`;

export const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;
