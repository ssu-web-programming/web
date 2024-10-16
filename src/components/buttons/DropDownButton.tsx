import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as IconArrowDown } from '../../img/ico_arrow_down_small.svg';
import { ReactComponent as IconArrowUp } from '../../img/ico_arrow_up_small.svg';
import {
  alignItemCenter,
  flex,
  flexColumn,
  flexGrow,
  flexShrink,
  justiCenter,
  justiStart
} from '../../style/cssCommon';
import IconComponent from '../IconComponent';

import Button, { ButtonProps } from './Button';

const DropDownWrapper = styled.div<{ hasSelectedOption?: boolean; width?: ButtonProps['width'] }>`
  ${flex};
  ${justiCenter};
  ${alignItemCenter};

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
  left: 0;
  transform: translate(0%, -100%);

  border-radius: 4px;
  border: solid 1px #6f3ad0;
  background-color: white;
  width: 140px;
`;

const FloatingItem = styled.div<{ isSelected: boolean }>`
  ${flex}
  ${justiStart}
  ${alignItemCenter}

  width: 100%;
  height: 24px;
  padding: 3px 10px;
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

const VersionInner = styled.div`
  display: flex;
  flex-direction: row;
`;

const NewMark = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 2px 0px 0px 2px;
  background-color: #fb4949;
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
                key={item.id}
                isSelected={selectedId === item.id}
                onClick={() => {
                  onItemClick(item);
                  setThumbItemId(item.id);
                }}>
                <VersionInner>
                  {item.id}
                  {['Claude 3.5 Sonnet', 'GPT 4o'].includes(item.id) && <NewMark />}
                </VersionInner>
              </FloatingItem>
            ))}
          </FloatingListWrapper>
        )}

        <Button
          {...rest}
          width={width}
          variant={'gray'}
          cssExt={css`
            padding: 0 8px;
          `}>
          <VersionInner>
            {hasSelectedOption ? selectedId : thumbItemId.length > 0 && thumbItemId}
            {['Claude 3.5 Sonnet', 'GPT 4o'].includes(thumbItemId) ||
            ['Claude 3.5 Sonnet', 'GPT 4o'].includes(selectedId) ? (
              <NewMark />
            ) : null}
          </VersionInner>
          <IconComponent iconComponent={isOpen ? IconArrowDown : IconArrowUp} />
        </Button>
      </DropDownWrapper>
    </>
  );
};

export default DropDownButton;
