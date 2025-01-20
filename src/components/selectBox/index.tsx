import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styled from 'styled-components';

import { ReactComponent as ArrowIcon } from '../../img/light/ico_arrow_down_normal.svg';

const Form = styled(FormControl)`
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
    border: 1px solid var(--gray-gray-30);
    border-radius: 8px;

    div {
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
      color: var(--gray-gray-90-01);
    }
  }
`;

const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    display: flex;
    justify-content: space-between;
  }

  &.Mui-selected {
    background-color: var(--ai-purple-97-list-over) !important;
    border-radius: 8px;
  }
`;

const ItemWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export type Item = { icon?: string; title: string; desc?: string; credit?: number };

interface SelectBoxProps {
  menuItem: Item[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
}

export default function SelectBox(props: SelectBoxProps) {
  const { menuItem, selectedItem, setSelectedItem } = props;

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 90 }}>
      <Form fullWidth>
        <Select
          value={selectedItem}
          onChange={handleChange}
          IconComponent={ArrowIcon}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: '-8.5px',
                ml: '-4px',
                boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--gray-gray-40)'
              }
            },
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'left'
            },
            transformOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            MenuListProps: {
              sx: {
                p: 0.5
              }
            }
          }}
          renderValue={(value) => {
            const selectedItem = menuItem.find((item) => item.title === value);
            return <div>{selectedItem?.title}</div>;
          }}>
          {menuItem.map((item, index) => {
            return (
              <StyledMenuItem value={item.title} key={index}>
                <ItemWrap>
                  {item.icon && <img src={item.icon} alt="icon" />}
                  {item.title}
                </ItemWrap>
              </StyledMenuItem>
            );
          })}
        </Select>
      </Form>
    </Box>
  );
}
