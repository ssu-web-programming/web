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
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <S.SelectContainer ref={selectRef} width={width}>
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
        <S.OptionsContainer role="listbox">
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
