import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

export const Form = styled(FormControl)<{ $cssExt?: FlattenSimpleInterpolation }>`
  .MuiInputBase-root {
    padding: 0 !important;

    svg {
      width: 20px;
      height: 20px;
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
    min-width: 90px;
    height: 29px !important;
    min-height: 29px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px 0 12px !important;
    border: 1px solid ${({ theme }) => theme.color.border.gray03};
    border-radius: 8px;
    box-sizing: border-box;
    ${(props) => props.$cssExt || ''};

    div {
      font-size: 14px;
      font-weight: 600;
      font-family: Pretendard, sans-serif;
      line-height: 21px;
      color: ${({ theme }) => theme.color.text.gray04};
    }
  }
`;

export const StyledSelect = styled(Select)``;

export const StyledMenuItem = styled(MenuItem)<{
  $isSelectedHighlighted: boolean;
  $cssExt?: FlattenSimpleInterpolation;
}>`
  &.MuiMenuItem-root {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 6px;
    padding: 0;
    ${(props) => props.$cssExt || ''};
  }

  &.Mui-selected {
    background-color: ${({ theme, $isSelectedHighlighted }) =>
      $isSelectedHighlighted ? theme.color.background.selected : 'transparent'} !important;
    border-radius: 8px;

    span {
      color: ${({ theme }) => theme.color.text.main};
    }
  }
`;

export const Divider = styled.div`
  width: 100%;
  border-bottom: ${({ theme }) => `1px solid ${theme.color.border.gray02}`};
`;

export const ItemWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-family: Pretendard, sans-serif;

  .content {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      word-break: break-word;
      white-space: normal;
    }
  }
`;

export const TextWrap = styled.div<{ selected: boolean }>`
  width: 100%;
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
