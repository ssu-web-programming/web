import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styled from 'styled-components';

import { ReactComponent as ArrowIcon } from '../img/ico_arrow_down_normal.svg';
import CheckIcon from '../img/ico_check_purple.svg';

const Form = styled(FormControl)`
  min-width: 136px;

  .MuiInputBase-root {
    fieldset {
      padding: 19px 8px;
      top: -8px;
    }
  }

  .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid #c9cdd2 !important;
  }

  .MuiSelect-select {
    padding-top: 12px;
    padding-right: 36px !important;
    padding-bottom: 12px;

    div {
      font-size: 16px;
    }
  }

  .MuiSelect-icon {
    top: calc(50% - 12px);
    right: 16px;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  min-width: 160px;

  &.MuiMenuItem-root {
    display: flex;
    justify-content: space-between;
  }
`;

const ItemWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #26282b;
`;

export type Item = { name: string; icon?: string };

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
    <Box sx={{ minWidth: 120 }}>
      <Form fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedItem}
          onChange={handleChange}
          IconComponent={ArrowIcon}
          MenuProps={{
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'left'
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left'
            },
            PaperProps: {
              sx: {
                borderRadius: '8px'
              }
            }
          }}
          renderValue={(value) => {
            const selectedItem = menuItem.find((item) => item.name === value);
            return <div>{selectedItem?.name}</div>;
          }}>
          {menuItem.map((item) => {
            return (
              <StyledMenuItem value={item.name} key={item.name}>
                <ItemWrap>
                  {item.icon && <img src={item.icon} alt="icon" />}
                  {item.name}
                </ItemWrap>
                {selectedItem === item.name && <img src={CheckIcon} alt="check" />}
              </StyledMenuItem>
            );
          })}
        </Select>
      </Form>
    </Box>
  );
}
