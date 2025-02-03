import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px;
  background-color: ${({ theme }) => theme.color.background.gray12};
  border-radius: 12px;
`;

export const Title = styled.span`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const Questions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  .item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    padding: 9.5px 0;

    span {
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
      color: ${({ theme }) => theme.color.text.gray05};
    }
  }

  .driver {
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.color.border.gray04};

    :last-child {
      display: none;
    }
  }
`;
