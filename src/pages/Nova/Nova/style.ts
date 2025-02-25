import styled from 'styled-components';

export const Wrapper = styled.div<{ isScroll: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
`;

export const Body = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background-color: ${({ theme }) => theme.color.background.bg};
`;

export const ImageBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const Icon = styled.div<{ disable: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    width: 48px;
    height: 48px;

    cursor: ${(props) => (props.disable ? 'initial' : 'pointer')};
    color: ${(props) => (props.disable ? '#454c5380' : 'var(--gray-gray-80-02)')};
  }

  span {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

export const Credit = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 2px 2px 12px;
  background: ${({ theme }) => theme.color.background.gray02};
  border-radius: 999px;

  .img {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 2px;
    color: ${({ theme }) => theme.color.text.gray03};
  }
`;

export const Guide = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #9ea4aa;
  white-space: break-spaces;
  text-align: center;
`;
