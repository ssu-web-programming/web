import styled from 'styled-components';

export const ModalContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;

  .close {
    position: absolute;
    top: 24px;
    right: 24px;
  }
`;

export const TextWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;

  .title {
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
    color: ${({ theme }) => theme.color.text.gray04};
    white-space: break-spaces;
  }

  .desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

export const ResultWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const ImageCircle = styled.div<{ isSelected: boolean }>`
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  background: ${({ theme, isSelected }) =>
    isSelected ? theme.color.background.mainBg02 : theme.color.background.gray02};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected ? 'var(--ai-purple-50-main)' : theme.color.border.gray02};
  border-radius: 120px;

  span {
    color: ${({ theme, isSelected }) =>
      isSelected ? theme.color.text.main : theme.color.text.gray12};
  }
`;

export const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CheckBoxWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6.5px;

  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: ${({ theme }) => theme.color.text.gray01};
  }
`;
