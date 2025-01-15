import styled from 'styled-components';

export interface ToggleOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleProps {
  options: ToggleOption[];
  activeId: string;
  onToggle: (id: string) => void;
  containerStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
}

interface ToggleButtonProps {
  isActive: boolean;
}

const ToggleContainer = styled.div`
  display: inline-flex;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 100px;
`;

const ToggleButton = styled.button<ToggleButtonProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 14px;
  transition: all 0.2s ease;

  ${({ isActive }) =>
    isActive
      ? `
      background: #F3E8FF;
      color: #9333EA;
    `
      : `
      background: transparent;
      color: #9CA3AF;
    `}

  &:hover {
    opacity: 0.9;
  }
`;

export default function Toggle({
  options,
  activeId,
  onToggle,
  containerStyle,
  buttonStyle
}: ToggleProps) {
  return (
    <ToggleContainer style={containerStyle}>
      {options.map((option) => (
        <ToggleButton
          key={option.id}
          isActive={activeId === option.id}
          onClick={() => onToggle(option.id)}
          style={buttonStyle}>
          {option.icon && option.icon}
          <span>{option.label}</span>
        </ToggleButton>
      ))}
    </ToggleContainer>
  );
}
