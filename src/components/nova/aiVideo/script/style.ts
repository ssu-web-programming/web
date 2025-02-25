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
  gap: 16px;
`;

export const TextWrap = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 188px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  gap: 8px;
  border: 1px solid
    ${({ isActive, theme }) => (isActive ? 'var(--ai-purple-50-main)' : theme.color.border.gray01)};
  border-radius: 8px;
  background: ${({ theme }) => (theme.mode === 'light' ? 'var(--white)' : 'none')};

  .length {
    width: 100%;
    font-size: 12px;
    font-weight: 400;
    line-height: 14.32px;
    text-align: left;
    color: ${({ theme }) => theme.color.text.gray09};
  }
`;

export const TextArea = styled.textarea<{ isEnabled: boolean }>`
  width: 100%;
  flex: 1;
  padding: 0;
  outline: none;
  resize: none;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  background: transparent;
  color: ${({ isEnabled, theme }) =>
    isEnabled ? theme.color.text.gray04 : theme.color.text.gray01};
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

export const LogoWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
