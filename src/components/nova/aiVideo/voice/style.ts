import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 0 16px;

  .logo {
    position: absolute;
    right: 16px;
    bottom: 24px;
  }
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
    color: #454c53;
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

export const VoiceItem = styled.div<{ isSelected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.color.background.selected : theme.color.background.gray01};
  border: 1px solid
    ${({ isSelected, theme }) => (isSelected ? 'var(--ai-purple-90)' : theme.color.border.gray05)};
  border-radius: 8px;
`;

export const VoiceInfo = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;

  .name {
    font-size: 14px;
    font-weight: 700;
    line-height: 21px;
    color: ${({ isSelected, theme }) =>
      isSelected ? theme.color.text.main : theme.color.text.gray03};
  }
`;

export const IdentifyWrap = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  img {
    width: 24px;
  }

  span {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ isSelected, theme }) =>
      isSelected ? theme.color.text.main : theme.color.text.gray03};
  }
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
