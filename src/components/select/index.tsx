import { ReactNode, useEffect, useRef, useState } from 'react';
import Icon from 'components/Icon';
import icArrowDown from 'img/ico_arrow_down_normal.svg';
import { FlattenSimpleInterpolation } from 'styled-components';

import * as S from './style';

// 스타일 주입을 위한 인터페이스
interface StyledProps {
  $containerStyle?: FlattenSimpleInterpolation;
  $selectButtonStyle?: FlattenSimpleInterpolation;
  $optionContainerStyle?: FlattenSimpleInterpolation;
  $optionStyle?: FlattenSimpleInterpolation;
  $iconStyles?: FlattenSimpleInterpolation;
}

export interface SelectOption<T extends string> {
  value: T;
  label?: string;
  component?: ReactNode;
  selected?: boolean;
}

interface SelectProps<T extends string> extends StyledProps {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  width?: string;
  component?: ReactNode;

  // 스타일 관련 옵션
  $stylesSelectedOption?: boolean;
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
  width,
  $containerStyle,
  $selectButtonStyle,
  $stylesSelectedOption = false,
  $optionContainerStyle,
  $optionStyle,
  $iconStyles
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) as SelectOption<T>;

  const defaultRenderSelectedValue = (option: SelectOption<T>) => {
    if (!option) {
      return <S.SelectText>{placeholder}</S.SelectText>;
    }
    if (option.component) {
      return option.component;
    }
    return <S.SelectText>{option.label}</S.SelectText>;
  };

  const defaultRenderOption = (option: SelectOption<T>) => {
    if (option.component) {
      return option.component;
    }
    return <S.OptionText>{option.label}</S.OptionText>;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <S.SelectContainer
      ref={selectRef}
      width={width}
      $containerStyle={$containerStyle}
      $stylesSelectedOption={$stylesSelectedOption}>
      <S.SelectButton
        type="button"
        isOpen={isOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
        onClick={() => setIsOpen(!isOpen)}
        $stylesSelectedOption={$stylesSelectedOption}
        $selectButtonStyle={$selectButtonStyle}>
        {defaultRenderSelectedValue(selectedOption)}
        <S.IconWrapper isOpen={isOpen} $iconStyles={$iconStyles}>
          <Icon iconSrc={icArrowDown} />
        </S.IconWrapper>
      </S.SelectButton>

      {isOpen && (
        <S.OptionsContainer role="listbox" $optionContainerStyle={$optionContainerStyle}>
          {options.map((option, index) => (
            <S.Option
              key={option.value}
              data-index={index}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              $optionStyle={$optionStyle}
              $stylesSelectedOption={$stylesSelectedOption}
              $selected={option.selected}>
              {defaultRenderOption(option)}
            </S.Option>
          ))}
        </S.OptionsContainer>
      )}
    </S.SelectContainer>
  );
}
