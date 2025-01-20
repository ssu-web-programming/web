import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const Wrap = styled(Container)`
  flex-direction: column;
`;

export const GuideExample = styled.div<{ isWithIcon: boolean }>`
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: ${({ isWithIcon }) => (isWithIcon ? 'flex-start' : 'center')};
  gap: 8px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background.gray01};

  span {
    font-size: 14px;
    line-height: 21px;
    color: ${({ theme }) => theme.color.text.gray03};
  }

  &:hover {
    cursor: pointer;
  }
`;

export const ScrollDownButton = styled.div`
  width: 48px;
  height: 48px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 126px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px 0 #0000001a;
  z-index: 1;

  button {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

export const ShareButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 12px;
  border-radius: 8px;
  color: ${({ disabled }) => (disabled ? 'var(--gray-gray-60-03)' : 'white')};
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  background-color: ${({ disabled }) => (disabled ? 'f2f4f6' : 'var(--ai-purple-50-main)')};
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};
`;

export const ShareGuide = styled.div<{ isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: ${({ theme, isActive }) =>
    isActive ? theme.color.mainBg : theme.color.background.gray01};
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  text-align: center;
  color: ${({ theme, isActive }) =>
    isActive ? theme.color.text.highlightText : theme.color.text.gray02};
  border: 1px solid ${({ theme }) => theme.color.border.gray02};

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme, isActive }) =>
      isActive ? theme.color.text.highlightText02 : theme.color.text.gray03};
  }
`;
