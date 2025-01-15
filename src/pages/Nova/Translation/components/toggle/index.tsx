import { FlattenSimpleInterpolation } from 'styled-components';

import * as S from './style';

export interface ToggleOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleProps {
  options: ToggleOption[];
  activeId: string;
  onToggle: (id: string) => void;
  containerStyle?: FlattenSimpleInterpolation;
  buttonStyle?: FlattenSimpleInterpolation;
}

export default function Toggle({
  options,
  activeId,
  onToggle,
  containerStyle,
  buttonStyle
}: ToggleProps) {
  return (
    <S.ToggleContainer containerStyle={containerStyle}>
      {options.map((option) => (
        <S.ToggleButton
          key={option.id}
          isActive={activeId === option.id}
          onClick={() => onToggle(option.id)}
          buttonStyle={buttonStyle}>
          {option.icon && option.icon}
          <span>{option.label}</span>
        </S.ToggleButton>
      ))}
    </S.ToggleContainer>
  );
}
