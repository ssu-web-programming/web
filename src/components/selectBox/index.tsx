import * as React from 'react';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { ReactComponent as ArrowIcon } from '../../img/light/ico_arrow_down_normal.svg';
import CreditIcon from '../../img/light/ico_credit_gray.svg';

import * as S from './style';

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
      <S.Form fullWidth>
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
                p: 0.5,
                minWidth: '290px'
              }
            }
          }}
          renderValue={(value) => {
            const selectedItem = menuItem.find((item) => item.title === value);
            return <div>{selectedItem?.title}</div>;
          }}>
          {menuItem.map((item, index) => {
            return (
              <S.StyledMenuItem value={item.title} key={index}>
                <S.ItemWrap>
                  {item.icon && <img src={item.icon} alt="icon" />}
                  <S.TextWrap selected={selectedItem === item.title}>
                    <span className="title">{item.title}</span>
                    <span className="desc">{item.desc}</span>
                  </S.TextWrap>
                  {item.credit && (
                    <S.CreditWrap>
                      <img src={CreditIcon} alt="credit" />
                      <span>{item.credit}</span>
                    </S.CreditWrap>
                  )}
                </S.ItemWrap>
              </S.StyledMenuItem>
            );
          })}
        </Select>
      </S.Form>
    </Box>
  );
}
