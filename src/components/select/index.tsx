import { useEffect, useRef, useState } from 'react';
import Icon from 'components/Icon';
import icArrowDown from 'img/ico_arrow_down_normal.svg';

import * as S from './style';

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  width?: string;
}

/**
 * @param options - Select 옵션 배열
 * @param value - 현재 선택된 값
 * @param onChange - 값 변경 시 호출되는 콜백 함수
 * @param placeholder - 선택된 값이 없을 때 표시될 텍스트
 * @param width - Select 컴포넌트의 너비 (선택적)
 * @returns Select 컴포넌트
 */
export default function Select<T extends string>({
  options,
  value,
  onChange,
  placeholder,
  width
}: SelectProps<T>) {
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
    <S.SelectContainer ref={selectRef} onKeyDown={handleKeyDown} width={width}>
      <S.SelectButton
        type="button"
        isOpen={isOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
        onClick={() => setIsOpen(!isOpen)}>
        <S.SelectText>{selectedOption ? selectedOption.label : placeholder}</S.SelectText>
        <S.IconWrapper isOpen={isOpen}>
          <Icon iconSrc={icArrowDown} />
        </S.IconWrapper>
      </S.SelectButton>

      {isOpen && (
        <S.OptionsContainer ref={listboxRef} role="listbox" tabIndex={-1}>
          {options.map((option, index) => (
            <S.Option
              key={option.value}
              data-index={index}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}>
              <S.OptionText>{option.label}</S.OptionText>
            </S.Option>
          ))}
        </S.OptionsContainer>
      )}
    </S.SelectContainer>
  );
}
