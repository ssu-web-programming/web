import { FlattenSimpleInterpolation } from 'styled-components';

import * as S from './style';

export interface ToggleOption<T> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleProps<T> {
  options: ToggleOption<T>[];
  type: T;
  onToggle: (id: T) => void;
  containerStyle?: FlattenSimpleInterpolation;
  buttonStyle?: FlattenSimpleInterpolation;
}

export default function Toggle<T>({
  options,
  type,
  onToggle,
  containerStyle,
  buttonStyle
}: ToggleProps<T>) {
  return (
    <S.ToggleContainer containerStyle={containerStyle}>
      {options.map((option, idx) => (
        <S.ToggleButton
          key={idx}
          isActive={type === option.id}
          onClick={() => onToggle(option.id)}
          buttonStyle={buttonStyle}>
          {option.icon && option.icon}
          <span>{option.label}</span>
        </S.ToggleButton>
      ))}
    </S.ToggleContainer>
  );
}
