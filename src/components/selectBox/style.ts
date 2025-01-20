import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import styled from 'styled-components';

export const Form = styled(FormControl)`
  .MuiInputBase-root {
    svg {
      width: 24px;
      height: 24px;
      top: unset;
    }
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  .MuiSelect-select {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 4.5px 4px 10px;
    border: 1px solid ${({ theme }) => theme.color.border.gray03};
    border-radius: 8px;

    div {
      font-size: 14px;
      font-weight: 600;
      font-family: Pretendard, sans-serif;
      line-height: 21px;
      color: ${({ theme }) => theme.color.text.gray04};
    }
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    display: flex;
    justify-content: space-between;
  }

  &.Mui-selected {
    background-color: ${({ theme }) => theme.color.background.selected} !important;
    border-radius: 8px;
  }
`;

export const ItemWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: Pretendard, sans-serif;
`;

export const TextWrap = styled.div<{ selected: boolean }>`
  min-width: 175px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  .title {
    font-size: 14px;
    font-weight: ${({ selected }) => (selected ? 700 : 500)};
    line-height: 21px;
    color: ${({ selected }) => (selected ? 'var(--ai-purple-50-main)' : 'var(--gray-gray-80-02)')};
  }

  .desc {
    font-size: 12px;
    font-weight: ${({ selected }) => (selected ? 500 : 400)};
    line-height: 18px;
    color: ${({ selected }) => (selected ? 'var(--ai-purple-50-main)' : 'var(--gray-gray-70)')};
  }
`;

export const CreditWrap = styled.div`
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4.5px;

  img {
    width: 15px;
    height: 15px;
  }

  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: var(--gray-gray-90-01);
  }
`;
