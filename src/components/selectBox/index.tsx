import React from 'react';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';
import { FlattenSimpleInterpolation } from 'styled-components';

import { ReactComponent as ArrowDarkIcon } from '../../img/dark/ico_arrow_down_normal.svg';
import CreditDarkIcon from '../../img/dark/ico_credit_gray.svg';
import { ReactComponent as ArrowLightIcon } from '../../img/light/ico_arrow_down_normal.svg';
import CreditLightIcon from '../../img/light/ico_credit_gray.svg';
import Spinner from '../../img/light/spinner.webp';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppSelector } from '../../store/store';

import * as S from './style';

export type Item = { key: string; icon?: string; title: string; desc?: string; credit?: string };

interface SelectBoxProps {
  placeHolder?: string;
  menuItem: Item[];
  selectedItem?: string;
  setSelectedItem: (item: string) => void;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  paddingX?: number;
  paddingY?: number;
  gap?: number;
  isMenuAbove?: boolean;
  isSelectedHighlighted?: boolean;
  isDriver?: boolean;
  isDisabled?: boolean;
  selectBoxCssExt?: FlattenSimpleInterpolation;
  innerBoxCssExt?: FlattenSimpleInterpolation;
}

export default function SelectBox({
  placeHolder,
  menuItem,
  selectedItem,
  setSelectedItem,
  minWidth,
  maxWidth,
  maxHeight,
  paddingX,
  paddingY,
  gap,
  isMenuAbove = true,
  isSelectedHighlighted = true,
  isDriver = false,
  isDisabled = false,
  selectBoxCssExt,
  innerBoxCssExt
}: SelectBoxProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setSelectedItem(event.target.value as string);
  };

  return (
    <Box>
      <S.Form $cssExt={selectBoxCssExt}>
        <S.StyledSelect
          value={selectedItem ?? placeHolder}
          onChange={handleChange}
          disabled={isDisabled}
          IconComponent={isLightMode ? ArrowLightIcon : ArrowDarkIcon}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: isMenuAbove ? '-8px' : '8px',
                ml: '-4px',
                boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${isLightMode ? 'var(--gray-gray-40)' : 'var(--gray-gray-87)'}`,
                borderRadius: '8px',
                backgroundColor: `${isLightMode ? 'var(--white)' : 'var(--gray-gray-90)'}`
              }
            },
            anchorOrigin: {
              vertical: isMenuAbove ? 'top' : 'bottom',
              horizontal: 'left'
            },
            transformOrigin: {
              vertical: isMenuAbove ? 'bottom' : 'top',
              horizontal: 'left'
            },
            MenuListProps: {
              sx: {
                px: `${paddingX}px`,
                py: `${paddingY}px`,
                minWidth: `${minWidth}px`,
                maxWidth: `${maxWidth}px`,
                maxHeight: `${maxHeight}px`,
                gap: `${gap}px`
              }
            }
          }}
          renderValue={(value) => {
            const selectedItem = menuItem.find((item) => item.key == value);

            return selectedItem ? (
              <div style={{ padding: '0', display: 'flex', alignItems: 'center' }}>
                {selectedItem.title}
              </div>
            ) : (
              <div style={{ padding: '0', display: 'flex', alignItems: 'center' }}>
                {placeHolder}
              </div>
            );
          }}>
          {menuItem.map((item, index) => {
            return (
              <S.StyledMenuItem
                key={item.key}
                value={item.key}
                $isSelectedHighlighted={isSelectedHighlighted}
                $cssExt={innerBoxCssExt}>
                <S.ItemWrap>
                  <div className="content">
                    {item.icon && <img src={item.icon} alt="icon" />}
                    <S.TextWrap selected={isSelectedHighlighted && selectedItem === item.key}>
                      <span className="title">{item.title}</span>
                      <span className="desc">{item.desc}</span>
                    </S.TextWrap>
                  </div>
                  {item.credit && (
                    <>
                      {item.credit === '-1' ? (
                        <img src={Spinner} alt="spinner" width={24} height={24} />
                      ) : (
                        <S.CreditWrap>
                          <img src={isLightMode ? CreditLightIcon : CreditDarkIcon} alt="credit" />
                          <span>{item.credit}</span>
                        </S.CreditWrap>
                      )}
                    </>
                  )}
                </S.ItemWrap>
                {isDriver && index < menuItem.length - 1 && <S.Divider />}
              </S.StyledMenuItem>
            );
          })}
        </S.StyledSelect>
      </S.Form>
    </Box>
  );
}
