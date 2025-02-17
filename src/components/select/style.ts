import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

const SelectContainer = styled.div<{
  width?: string;
  $containerStyle?: FlattenSimpleInterpolation;
  $stylesSelectedOption?: boolean;
}>`
  position: relative;
  width: ${({ width }) => width || '100%'};

  ${({ $containerStyle }) => $containerStyle && $containerStyle}
`;

const SelectButton = styled.button<{
  isOpen: boolean;
  $selectButtonStyle?: FlattenSimpleInterpolation;
  $stylesSelectedOption?: boolean;
}>`
  position: relative;
  width: 100%;
  text-align: left;
  background: transparent;
  color: ${({ theme }) => theme.color.text.gray04};
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  padding: 0;

  ${({ $stylesSelectedOption }) =>
    $stylesSelectedOption &&
    css`
      background: #ede5fe;
      box-shadow: 0 0 0 1px var(--ai-purple-90) inset;
    `}
  & p:nth-child(1) {
    font-size: 16px !important;
    font-weight: ${({ $stylesSelectedOption }) => ($stylesSelectedOption ? 700 : 500)} !important;
    color: ${({ $stylesSelectedOption }) =>
      $stylesSelectedOption ? '#6F3AD0' : '#454c53'} !important;
  }

  & p:nth-child(2) {
    font-size: 12px !important;
    color: ${({ $stylesSelectedOption }) =>
      $stylesSelectedOption ? '#6F3AD0' : '#72787f'} !important;
  }

  ${({ $selectButtonStyle }) => $selectButtonStyle && $selectButtonStyle}
`;

const SelectText = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-align: right;
  padding-right: 25px;
  font-weight: 500;
  font-size: 14px;
`;

const IconWrapper = styled.span<{ isOpen: boolean; $iconStyles?: FlattenSimpleInterpolation }>`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%) ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  transition: transform 0.2s ease;

  ${({ $iconStyles }) => $iconStyles && $iconStyles}
`;

const OptionsContainer = styled.div<{ $optionContainerStyle?: FlattenSimpleInterpolation }>`
  position: absolute;
  top: calc(100% + 9px);
  right: 0;
  z-index: 10;
  max-height: 240px;
  overflow-y: auto;
  background: ${({ theme }) => theme.color.background.gray03};
  border: 1px solid ${({ theme }) => theme.color.border.gray01};
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 #0000001a;
  width: max-content;
  padding: 8px 16px;

  /* 세로 모드 */
  @media screen and (orientation: portrait) {
    max-height: 240px;
    overflow-y: auto;
  }

  /* 가로 모드 */
  @media screen and (orientation: landscape) {
    max-height: 110px;
    overflow-y: auto;
  }

  ${({ $optionContainerStyle }) => $optionContainerStyle && $optionContainerStyle}
`;

const Option = styled.div<{
  $optionStyle?: FlattenSimpleInterpolation;
  $stylesSelectedOption?: boolean;
  $selected?: boolean;
}>`
  padding: 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.text.gray04};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.color.border.gray05};
  }

  /* 호진TODO: Mobile에서도 hover가 적용되는지 확인 필요 */
  ${({ $stylesSelectedOption }) =>
    $stylesSelectedOption &&
    css`
      &:hover {
        background: #f2f4f6;
        border-radius: 8px;
      }
    `}

  ${({ $selected }) =>
    $selected &&
    css`
      background: #e8ebed;
      border-radius: 8px;
    `}

  ${({ $optionStyle }) => $optionStyle && $optionStyle}
`;

const OptionText = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export {
  IconWrapper,
  Option,
  OptionsContainer,
  OptionText,
  SelectButton,
  SelectContainer,
  SelectText
};
