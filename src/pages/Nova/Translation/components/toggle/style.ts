import styled, { FlattenSimpleInterpolation } from 'styled-components';

interface ToggleButtonProps {
  isActive: boolean;
  buttonStyle?: FlattenSimpleInterpolation;
}

const ToggleButton = styled.button<ToggleButtonProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 14px;

  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;

  ${({ isActive }) =>
    isActive
      ? `
      background: #F3E8FF;
      color: #6F3AD0;
      border: 1px solid #c6a9ff;
    `
      : `
      background: transparent;
      color: #9CA3AF;
    `}

  &:hover {
    opacity: 0.9;
  }

  ${({ buttonStyle }) => buttonStyle && buttonStyle}
`;

const ToggleContainer = styled.div<{
  containerStyle?: FlattenSimpleInterpolation;
}>`
  display: inline-flex;
  background: #f2f4f6;
  padding: 4px;
  border-radius: 100px;
  border: 1px solid #e8ebed;

  ${({ containerStyle }) => containerStyle && containerStyle}
`;

export { ToggleButton, ToggleContainer };
