import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex: 1 1 0;
  margin-bottom: 16px;
  overflow-y: auto;
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
`;

export const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    path {
      fill: ${({ theme }) => theme.color.background.gray17} !important;
    }
  }
`;

export const Title = styled.div`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  white-space: break-spaces;
  color: ${({ theme }) => theme.color.text.gray06};
`;

export const ButtonWrap = styled.div`
  width: 100%;
  height: 48px;
  min-height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  background: #6f3ad0;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  div {
    position: absolute;
    right: 12px;
    display: flex;
    gap: 2px;

    span {
      font-size: 14px;
      font-weight: 500;
    }
    img {
      width: 20px;
    }
  }

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: white;
  }
`;
