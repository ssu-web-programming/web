import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { initFlagSelector } from 'store/slices/initFlagSlice';
import styled, { css } from 'styled-components';

import { NOVA_TAB_TYPE } from '../constants/novaTapTypes';
import { selectTabSlice } from '../store/slices/tabSlice';
import { userInfoSelector } from '../store/slices/userInfo';
import { useAppSelector } from '../store/store';
import Bridge from '../util/bridge';

import Icon from './Icon';

export type TooltipType = 'selectable' | 'normal';
export type TooltipPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
export type TooltipOption = {
  name:
    | string
    | {
        text: string;
      };
  nameWithIcon?: ReactElement;
  icon?: {
    src: string;
    txt?: string;
  };
  category?: string;
  onClick?: () => void;
};

type TooltipProps = {
  title?: string;
  options: TooltipOption[];
  placement: TooltipPlacement;
  type?: TooltipType;
  children: React.ReactNode;
  distance?: number; // distance between tooltip and children
  initPos?: boolean; // if true, tooltip will be positioned as initial
  style?: React.CSSProperties;
  onClick?: () => void;
};

const STYLE_BY_TYPE = {
  selectable: css`
    cursor: pointer;
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

const TootipButton = styled.div<{ $isInit: boolean }>`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: transparent;
  pointer-events: ${({ $isInit }) => ($isInit ? 'auto' : 'none')};
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
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 #0000001a;
  background-color: ${({ theme }) => (theme.mode === 'light' ? 'white' : 'var(--gray-gray-87)')};
  z-index: 20;
  margin-left: ${({ distance }) => distance}px;

  ul {
    gap: ${({ type }) => (type === 'selectable' ? '6px' : '0')};
  }
`;

const OptionList = styled.ul`
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.text.gray04};
`;

const CategoryItem = styled.li`
  margin: 8px 0;

  list-style: none;

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
  color: ${({ theme }) => theme.color.text.gray04};
`;

const OptionItemWrapper = styled.div<{ type: TooltipType }>`
  ${({ type }) => STYLE_BY_TYPE[type]}
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.color.border.gray02};

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
    initPos = false
  } = props;

  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { isInit } = useAppSelector(initFlagSelector);

  const handleClickOutside = (event: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTooltip = () => {
    Bridge.callBridgeApi('analyzeCurFile');

    if (isAgreed === undefined) return;
    if (isAgreed === false && selectedNovaTab === NOVA_TAB_TYPE.aiChat) return;
    if (props.onClick) {
      props.onClick();
    }

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
      <TootipButton $isInit={isInit} onClick={toggleTooltip}>
        {children}
      </TootipButton>
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
          {type === 'normal' && <Divider />}
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
      <>
        <li style={{ listStyle: isBullet ? 'disc' : 'none' }}>
          <OptionItemWrapper type={type} onClick={handleOnClick}>
            <div style={{ marginRight: '6px' }}>
              <Icon iconSrc={option.icon?.src} size={24} />
            </div>
            <span>
              {option.nameWithIcon
                ? option.nameWithIcon
                : typeof option.name === 'string'
                  ? option.name
                  : option.name.text}
            </span>
          </OptionItemWrapper>
        </li>
        <Divider />
      </>
    );
  }

  return (
    <li style={{ listStyle: isBullet ? 'disc' : 'none' }}>
      <OptionItemWrapper type={type}>
        <p>
          {option.nameWithIcon
            ? option.nameWithIcon
            : typeof option.name === 'string'
              ? option.name
              : option.name.text}
        </p>
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
