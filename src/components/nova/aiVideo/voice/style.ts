import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
`;

export const TitleWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .wrap {
    display: flex;
    gap: 4px;
  }

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
`;

export const VoiceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FilterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const SelectBoxWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .language-with-info {
    display: flex;
    align-items: center;

    .info-icon {
      cursor: pointer;
    }
  }
`;

export const VoiceListContainer = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 328px;
`;

export const FilterRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.gray01};

  .language-with-info {
    display: flex;
    align-items: center;

    .info-icon {
      cursor: pointer;
    }
  }

  button {
    min-width: auto;
    padding: 0;
    margin-left: 8px;
  }

  svg {
    width: 24px !important;
    height: 24px !important;
    &.MuiSelect-icon {
      right: -2px !important;
    }
  }
`;

export const VoiceListWrap = styled.div`
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
`;

export const VoiceInfoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .radio {
    width: 16px;
    height: 16px;
  }
`;

export const VoiceItem = styled.div<{ isSelected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.color.background.bg};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.gray01};

  &:last-child {
    border-bottom: none;
  }
`;

export const VoiceInfo = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .name {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

export const IdentifyWrap = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    width: 16px;
    height: 12px;
  }

  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.color.text.gray07};
  }
`;

export const NoVoicesMessage = styled.div`
  width: 100%;
  padding: 16px;
  text-align: center;
  color: ${({ theme }) => theme.color.text.gray07};
  font-size: 14px;
`;

export const LoadingMessage = styled.div`
  width: 100%;
  padding: 8px;
  text-align: center;
  color: ${({ theme }) => theme.color.text.gray07};
  font-size: 12px;
`;

export const SkeletonWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  margin-top: auto;
`;

export const CreditInfo = styled.div`
  width: 37px;
  position: absolute;
  right: 16px;
  display: flex;
  gap: 0.5px;

  img {
    width: 20px;
    height: 20px;
  }

  span {
    width: 15px;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
  }
`;

export const RadioCircle = styled.div<{ isSelected: boolean }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid
    ${({ isSelected, theme }) => (isSelected ? theme.color.main : theme.color.border.gray01)};
  transition: all 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ isSelected, theme }) => (isSelected ? theme.color.main : 'transparent')};
    transition: all 0.2s ease;
  }
`;
