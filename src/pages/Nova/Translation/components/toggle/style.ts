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
  width: 100%;

  ${({ isActive, theme }) =>
    isActive
      ? `
      background: ${theme.color.background.selected};
      color: ${theme.color.background.purple01};
      border: 1px solid ${theme.color.border.purple01};
    `
      : `
      background: transparent;
      color: ${theme.color.text.gray01};
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
  background: ${({ theme }) => theme.color.background.gray06};
  padding: 4px;
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.color.background.gray07};
  width: 100%;

  ${({ containerStyle }) => containerStyle && containerStyle}
`;

export { ToggleButton, ToggleContainer };
