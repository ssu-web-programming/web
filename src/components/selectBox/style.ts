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
    height: 29px !important;
    min-height: 29px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 4.5px 4px 10px;
    border: 1px solid ${({ theme }) => theme.color.border.gray03};
    border-radius: 8px;
    box-sizing: border-box;

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
    color: ${({ selected, theme }) =>
      selected ? theme.color.text.highlight03 : theme.color.text.gray03};
  }

  .desc {
    font-size: 12px;
    font-weight: ${({ selected }) => (selected ? 500 : 400)};
    line-height: 18px;
    color: ${({ selected, theme }) =>
      selected ? theme.color.text.highlight03 : theme.color.text.gray09};
  }
`;

export const CreditWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4.5px;
  margin-left: 4px;

  img {
    width: 20px;
    height: 20px;
  }

  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: ${({ theme }) => theme.color.text.gray04};
  }
`;
