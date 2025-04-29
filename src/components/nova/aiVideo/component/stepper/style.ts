import styled from 'styled-components';

export const StepperContainer = styled.div`
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 12px 0;
`;

export const StepIconsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
`;

export const StepItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 3;
`;

export const StepIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  height: 24px;
  margin-bottom: 4px;
`;

export const StepIcon = styled.div<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ selected, theme }) =>
    selected ? theme.color.background.purple01 : theme.color.background.gray15};
  border-radius: 50%;
  z-index: 2;
`;

export const StepNumber = styled.span<{ selected: boolean }>`
  color: ${({ selected, theme }) =>
    selected ? theme.color.text.highlight04 : theme.color.text.gray11};
  font-size: 13px;
`;

export const StepLabel = styled.span<{ selected: boolean }>`
  font-weight: ${({ selected }) => (selected ? 600 : 400)};
  font-size: 14px;
  line-height: 20px;
  color: ${({ selected, theme }) => (selected ? theme.color.text.gray04 : theme.color.text.gray02)};
  text-align: center;
  width: 100%;
`;

export const StepConnector = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.color.border.gray05};
  position: absolute;
  top: 12px;
  left: calc(16.67% + 10px);
  right: calc(16.67% + 10px);
  z-index: 1;
`;
