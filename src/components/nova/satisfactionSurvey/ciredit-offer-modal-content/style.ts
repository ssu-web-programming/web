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

export const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const TextWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;

  .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;

    span {
      font-size: 20px;
      font-weight: 700;
      line-height: 30px;
      color: ${({ theme }) => theme.color.text.gray04};
      white-space: break-spaces;
    }
  }

  .desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.gray03};
    white-space: break-spaces;
  }
`;

export const ImageWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  img {
    width: 100%;
  }
`;

export const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BuyButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.main};
  }

  svg {
    path {
      fill: ${({ theme }) => theme.color.text.main};
    }
  }
`;
