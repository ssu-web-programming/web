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
  transform: translateY(-50%) rotate(0);
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
  box-shadow: 0px 2px 8px 0px #0000001a;
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

export {
  IconWrapper,
  Option,
  OptionsContainer,
  OptionText,
  SelectButton,
  SelectContainer,
  SelectText
};
