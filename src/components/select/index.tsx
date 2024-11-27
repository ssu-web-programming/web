import { useEffect, useRef, useState } from 'react';
import Icon from 'components/Icon';
import icArrowDown from 'img/ico_arrow_down_normal.svg';
import styled from 'styled-components';

const SelectContainer = styled.div<{ width?: string }>`
  position: relative;
  width: ${({ width }) => width || '256px'};
`;

const SelectButton = styled.button<{ isOpen: boolean }>`
  position: relative;
  width: 100%;
  text-align: left;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  padding: 0px;
`;

const SelectText = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-align: right;
  padding-right: 25px;
  font-weight: 400;
  font-size: 14px;
`;

const IconWrapper = styled.span<{ isOpen: boolean }>`
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%) ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  transition: transform 0.2s ease;
`;

const OptionsContainer = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 240px;
  overflow-y: auto;
  background: white;
  border: 1px solid #c9cdd2;
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: max-content;
  padding: 8px 16px;
`;

const Option = styled.div`
  padding: 8px 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #26282b;

  &:not(:last-child) {
    border-bottom: 1px solid #e8ebed;
  }
`;

const OptionText = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
}

const Select = ({ options = [], value = '', onChange, placeholder, width }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(0);
      return;
    }

    if (isOpen) {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setActiveIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setActiveIndex((prev) => Math.min(options.length - 1, prev + 1));
          break;
        case 'Enter':
          event.preventDefault();
          if (activeIndex >= 0) {
            onChange(options[activeIndex].value);
            setIsOpen(false);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          break;
      }
    }
  };

  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const activeElement = listboxRef.current.querySelector(`[data-index="${activeIndex}"]`);
      activeElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <SelectContainer ref={selectRef} onKeyDown={handleKeyDown} width={width}>
      <SelectButton
        type="button"
        isOpen={isOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
        onClick={() => setIsOpen(!isOpen)}>
        <SelectText>{selectedOption ? selectedOption.label : placeholder}</SelectText>
        <IconWrapper isOpen={isOpen}>
          <Icon iconSrc={icArrowDown} />
        </IconWrapper>
      </SelectButton>

      {isOpen && (
        <OptionsContainer ref={listboxRef} role="listbox" tabIndex={-1}>
          {options.map((option, index) => (
            <Option
              key={option.value}
              data-index={index}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}>
              <OptionText>{option.label}</OptionText>
            </Option>
          ))}
        </OptionsContainer>
      )}
    </SelectContainer>
  );
};

export default Select;
