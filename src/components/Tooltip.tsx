import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import Bridge from '../util/bridge';

import Icon from './Icon';
import { useAppSelector } from '../store/store';
import { selectTabSlice } from '../store/slices/tabSlice';

export type TooltipType = 'selectable' | 'normal';
export type TooltipPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
export type TooltipOption = {
  name: string;
  icon?: {
    src: string;
    txt?: string;
  };
  category?: string;
  onClick?: () => void;
};

interface GroupedTooltipOption {
  options: TooltipOption[];
  handleOptionSelect: (option: TooltipOption) => void;
  type: string;
}

type TooltipProps = {
  title?: string;
  options: TooltipOption[];
  placement: TooltipPlacement;
  type?: TooltipType;
  children: React.ReactNode;
  distance?: number; // distance between tooltip and children
  initPos?: boolean; // if true, tooltip will be positioned as initial
  condition?: boolean; // if false, tooltip will not be opened
  style?: React.CSSProperties;
};

const STYLE_BY_TYPE = {
  selectable: css`
    cursor: pointer;
    padding: 12px 0;
    justify-content: flex-start;
  `,
  normal: css`
    padding-top: 6px;
    line-height: 24px;
    justify-content: space-between;
  `
};

const TooltipContainer = styled.div<{ initPos: boolean }>`
  width: 100%;
  height: 100%;
  position: ${({ initPos }) => (initPos ? 'initial' : 'relative')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TootipButton = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: transparent;
`;

const TooltipContent = styled.div<{
  isOpen: boolean;
  placement: string;
  type: TooltipType;
  distance: number;
}>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: ${({ placement, distance }) =>
    placement.startsWith('top') ? 'auto' : `calc(100% + ${distance}px)`};
  bottom: ${({ placement, distance }) =>
    placement.startsWith('top') ? `calc(100% + ${distance}px)` : 'auto'};
  left: ${({ placement }) => (placement.endsWith('start') ? '0' : 'auto')};
  right: ${({ placement }) => (placement.endsWith('end') ? '0' : 'auto')};
  width: max-content;
  padding: ${({ type }) => (type === 'selectable' ? '0 16px' : '12px 16px')};
  border: 1px solid var(--gray-gray-40);
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 2px 8px 0px #0000001a;

  z-index: 10;
  margin-left: ${({ distance }) => distance}px;
`;

const OptionList = styled.ul`
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  color: #26282b;
`;

const CategoryItem = styled.li`
  margin: 8px 0;

  ::marker {
    display: none;
    content: '';
  }
`;

const Title = styled.div`
  padding-bottom: 8px;
  line-height: 24px;
  font-weight: 500;
  font-size: 16px;
  color: var(--gray-gray-90-01);
`;

const OptionItemWrapper = styled.div<{ type: TooltipType }>`
  ${({ type }) => STYLE_BY_TYPE[type]}
  display: flex;
  align-items: center;
  font-size: 14px;

  color: var(--gray-gray-90-01);
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--gray-gray-30);

  &:last-child {
    display: none;
  }
`;

const ChipWrapper = styled.div`
  display: flex;
  margin: 0 4px 0 20px;
  align-items: center;
`;

const Tooltip = (props: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const {
    options,
    placement,
    children,
    title,
    type = 'normal',
    distance = 4,
    condition,
    initPos = false
  } = props;
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const handleClickOutside = (event: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTooltip = () => {
    Bridge.callBridgeApi('analyzeCurFile');

    if (condition === false && selectedNovaTab === 'aiChat') return;
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: TooltipOption) => {
    if (type === 'selectable') {
      option?.onClick && option.onClick();
    }

    setIsOpen(false);
  };

  const categorizedOptions: { [key: string]: TooltipOption[] } = options.reduce(
    (acc, option) => {
      const category = option.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(option);
      return acc;
    },
    {} as { [key: string]: TooltipOption[] }
  );

  return (
    <TooltipContainer ref={tooltipRef} initPos={initPos}>
      <TootipButton onClick={toggleTooltip}>{children}</TootipButton>
      <TooltipContent
        isOpen={isOpen}
        placement={placement}
        type={type}
        distance={distance}
        style={props.style}>
        {title && (
          <>
            <Title>{title}</Title>
            <Divider />
          </>
        )}
        <OptionList>
          {Object.keys(categorizedOptions).map((category) => {
            if (category !== 'uncategorized') {
              return (
                <CategoryItem key={category}>
                  <span>{category}</span>
                  <ul className="list">
                    {categorizedOptions[category].map((option, idx) => (
                      <Tooltip.OptionItem
                        key={`${option.name}-${idx}`}
                        onSelect={() => handleOptionSelect(option)}
                        option={option}
                        type={type}
                        isBullet={true}
                      />
                    ))}
                  </ul>
                </CategoryItem>
              );
            }
            return null;
          })}
          <Divider />
          {categorizedOptions['uncategorized']?.map((option, idx) => (
            <Tooltip.OptionItem
              key={`${option.name}-${idx}`}
              onSelect={() => handleOptionSelect(option)}
              option={option}
              type={type}
              isBullet={false}
            />
          ))}
        </OptionList>
      </TooltipContent>
    </TooltipContainer>
  );
};

const OptionItem = (props: {
  option: TooltipOption;
  type: TooltipType;
  isBullet: boolean;
  onSelect?: () => void;
}) => {
  const { option, type, onSelect, isBullet } = props;

  const handleOnClick = () => {
    if (type === 'selectable' && onSelect) {
      onSelect();
    }
  };

  if (type === 'selectable') {
    return (
      <li style={{ listStyle: isBullet ? 'disc' : 'none' }}>
        <OptionItemWrapper type={type} onClick={handleOnClick}>
          <div style={{ marginRight: '6px' }}>
            <Icon iconSrc={option.icon?.src} size={24} />
          </div>
          <span>{option.name}</span>
        </OptionItemWrapper>
        <Divider />
      </li>
    );
  }

  return (
    <li style={{ listStyle: isBullet ? 'disc' : 'none' }}>
      <OptionItemWrapper type={type}>
        {option.name}
        <Tooltip.Chip option={option} />
      </OptionItemWrapper>
    </li>
  );
};

const Chip = (props: { option: TooltipOption }) => {
  const { icon } = props.option;
  return (
    <ChipWrapper>
      {icon?.txt && <span style={{ marginRight: '4px' }}>{icon.txt}</span>}
      <Icon iconSrc={icon?.src} size={16} />
    </ChipWrapper>
  );
};

Tooltip.OptionItem = OptionItem;
Tooltip.Chip = Chip;

export default Tooltip;
