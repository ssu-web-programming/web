import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Icon from './Icon';

export type TooltipType = 'selectable' | 'normal';
export type TooltipPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
export type TooltipOption = {
  name: string;
  icon?: {
    src: string;
    txt?: string;
  };
};

type TooltipProps = {
  title?: string;
  options: TooltipOption[];
  placement: TooltipPlacement;
  type?: TooltipType;
  onSelect?: (option: string) => void;
  children: React.ReactNode;
};

const STYLE_BY_TYPE = {
  selectable: css`
    cursor: pointer;
    padding: 12px 0;
    justify-content: flex-start;
  `,
  normal: css`
    padding: 6px 0 6px;
    justify-content: space-between;
  `
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TootipButton = styled.div`
  cursor: pointer;
`;

const TooltipContent = styled.div<{ isOpen: boolean; placement: string; type: TooltipType }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: ${({ placement }) => (placement.startsWith('top') ? 'auto' : 'calc(100% + 4px)')};
  bottom: ${({ placement }) => (placement.startsWith('top') ? 'calc(100% + 4px)' : 'auto')};
  left: ${({ placement }) => (placement.endsWith('start') ? '0' : 'auto')};
  right: ${({ placement }) => (placement.endsWith('end') ? '0' : 'auto')};
  min-width: 165px;
  padding: ${({ type }) => (type === 'selectable' ? '0 16px' : '12px 16px')};
  border: 1px solid var(--gray-gray-40);
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 6px 12px 0px #383f4733;
  z-index: 10;
`;

const OptionList = styled.ul`
  margin: 0;
  padding: 0;
`;

const Title = styled.div`
  padding-bottom: 8px;
  line-height: 24px;
  font-weight: 500;
  font-size: 16px;
  color: var(--gray-gray-90-01);
`;

const OptionItemWrapper = styled.li<{ type: TooltipType }>`
  ${({ type }) => STYLE_BY_TYPE[type]}
  display: flex;
  align-items: center;
  font-size: 14px;
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
  margin-right: 4px;
`;

const Tooltip = (props: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { options, onSelect, placement, children, title, type = 'normal' } = props;

  const handleClickOutside = (event: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTooltip = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    if (type === 'selectable') {
      onSelect && onSelect(option);
    }
    setIsOpen(false);
  };

  return (
    <TooltipContainer ref={tooltipRef}>
      <TootipButton onClick={toggleTooltip}>{children}</TootipButton>
      <TooltipContent isOpen={isOpen} placement={placement} type={type}>
        {title && (
          <>
            <Title>{title}</Title>
            <Divider />
          </>
        )}
        <OptionList>
          {options.map((option, idx) => (
            <Tooltip.OptionItem
              key={`${option.name}-${idx}`}
              onSelect={() => handleOptionSelect(option.name)}
              option={option}
              type={type}
            />
          ))}
        </OptionList>
      </TooltipContent>
    </TooltipContainer>
  );
};

const OptionItem = (
  props: Pick<TooltipProps, 'onSelect'> & { option: TooltipOption; type: TooltipType }
) => {
  const { option, type, onSelect } = props;

  const handleOnClick = () => {
    if (type === 'selectable' && onSelect) {
      onSelect(option.name);
    }
  };

  if (type === 'selectable') {
    return (
      <>
        <OptionItemWrapper type={type} onClick={handleOnClick}>
          <div style={{ marginRight: '6px' }}>
            <Icon iconSrc={option.icon?.src} size={18} />
          </div>
          <span>{option.name}</span>
        </OptionItemWrapper>
        <Divider />
      </>
    );
  }

  return (
    <OptionItemWrapper type={type}>
      {option.name}
      <Tooltip.Chip option={option} />
    </OptionItemWrapper>
  );
};

const Chip = (props: { option: TooltipOption }) => {
  const { icon } = props.option;
  return (
    <ChipWrapper>
      {icon?.txt && <span style={{ marginRight: '4px' }}>{icon.txt}</span>}
      <Icon iconSrc={icon?.src} size={21} />
    </ChipWrapper>
  );
};

Tooltip.OptionItem = OptionItem;
Tooltip.Chip = Chip;

export default Tooltip;
