import { ReactComponent as IconArrowDown } from '../../img/ico_arrow_down_small_comp.svg';
import { ReactComponent as IconArrowUp } from '../../img/ico_arrow_up_small_comp.svg';
import { useMemo, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import {
  alignItemCenter,
  flex,
  flexColumn,
  flexGrow,
  flexShrink,
  justiCenter
} from '../../style/cssCommon';
import Button, { ButtonProps } from './Button';
import IconComponent from '../IconComponent';

const DropDownWrapper = styled.div<{ hasSelectedOption?: boolean; width?: ButtonProps['width'] }>`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}
  
  position: relative;
  box-sizing: border-box;
  height: 24px;
  gap: 2px;
  width: ${({ width }) => (width ? `${width}px` : 'fit-content')};

  svg {
    color: ${({ hasSelectedOption }) => (hasSelectedOption ? '#fff' : '#26282b')};
  }
`;

const FloatingListWrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${flexGrow}
  ${flexShrink}

  font-size: 12px;
  position: absolute;
  top: 0px;
  transform: translate(0%, -100%);

  border-radius: 4px;
  border: solid 1px #6f3ad0;
  background-color: white;
  width: 100%;
`;

const FloatingItem = styled.div<{ isSelected: boolean }>`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}

  width: 100%;
  height: 24px;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background-color: #f3effc;
  }

  ${({ isSelected }) =>
    isSelected &&
    css`
      font-weight: bold;
      color: #6f3ad0;
      background-color: #f3effc;
    `}
`;

interface DropDownProps<T> extends ButtonProps {
  list: T[];
  onItemClick: (item: T) => void;
  selectedId: string;
  defaultId: string;
}

const DropDownButton = <T extends { id: string }>(props: DropDownProps<T>) => {
  const { selectedId, list, onItemClick, defaultId, width, ...rest } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [thumbItemId, setThumbItemId] = useState<string>('');
  const hasSelectedOption = useMemo(
    () => list.filter((v) => selectedId === v.id).length > 0,
    [selectedId, list]
  );

  useEffect(() => {
    setThumbItemId(defaultId);
  }, [defaultId]);

  return (
    <>
      <DropDownWrapper
        width={width}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else if (!isOpen) {
            setIsOpen(true);
          }
        }}
        hasSelectedOption={hasSelectedOption}>
        {isOpen && (
          <FloatingListWrapper>
            {list.map((item) => (
              <FloatingItem
                isSelected={selectedId === item.id}
                onClick={() => {
                  onItemClick(item);
                  setThumbItemId(item.id);
                }}>
                {item.id}
              </FloatingItem>
            ))}
          </FloatingListWrapper>
        )}

        <Button
          {...rest}
          width={width}
          variant={hasSelectedOption ? 'purple' : 'gray'}
          cssExt={css`
            padding: 0px;
          `}>
          <div>{hasSelectedOption ? selectedId : thumbItemId.length > 0 && thumbItemId}</div>
          <IconComponent iconComponent={isOpen ? IconArrowDown : IconArrowUp} />
        </Button>
      </DropDownWrapper>
    </>
  );
};

export default DropDownButton;
