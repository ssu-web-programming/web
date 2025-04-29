import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: calc(100% - 72px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 0 16px;
`;

export const TitleWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .title {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.gray04};
  }
  button {
    min-width: auto;
    padding: 0;
  }
`;

export const ScriptContainer = styled.div`
  width: 100%;
  min-height: 204px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

export const TextWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  gap: 8px;
  border: 2px solid var(--ai-purple-50-main);
  border-radius: 8px;
  background: ${({ theme }) => (theme.mode === 'light' ? 'var(--white)' : 'none')};

  .length-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .length {
    font-size: 12px;
    font-weight: 400;
    line-height: 14.32px;
    text-align: right;
    color: ${({ theme }) => theme.color.text.gray09};
  }

  .tooltip-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

export const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;

export const CreditInfo = styled.div`
  display: flex;
  width: 37px;

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
