import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 6px;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const StyledButton = styled.div<{ isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;

  img {
    transform: ${({ isExpanded }) => (isExpanded ? 'rotate(180deg)' : 'rotate(0)')};
    transition: transform 0.3s ease-in-out;
  }
`;

export const ItemWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: flex-start;
  gap: 4px;
`;

export const Item = styled.div<{ isMobile?: boolean }>`
  height: ${({ isMobile }) => (isMobile ? '28px' : '91px')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: ${({ isMobile }) => (isMobile ? '4px' : '8px')};
  background-color: ${({ theme }) => theme.color.background.gray12};
  border-radius: 8px;
  cursor: pointer;

  span {
    font-size: 11px;
    font-weight: 400;
    line-height: 16.5px;
    color: ${({ theme }) => theme.color.text.gray04};
  }

  .title span {
    height: 51px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .site {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;

    span {
      line-height: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: ${({ isMobile }) => (isMobile ? 'unset' : '-webkit-box')};
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }

  &.more {
    max-width: 58px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      font-size: 13px;
      font-weight: 500;
      line-height: 19.5px;
    }
  }
`;

export const SheetWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  padding: 0 0 16px 0;
  overflow-y: auto;
`;

export const SheetHeader = styled.div`
  padding: 0 16px;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const SheetContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;

  .driver {
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.color.border.gray04};

    :last-child {
      display: none;
    }
  }
`;

export const SheetItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;

  .title {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.gray03};
  }

  .desc {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: ${({ theme }) => theme.color.text.gray10};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
