import styled from 'styled-components';

const StyledButton = styled.button<{ selected: boolean }>`
  width: 100%;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${({ selected }) => (selected ? '#EDE5FE' : '#F2F4F6')};
  border: 1px solid ${({ selected }) => (selected ? '#EDE5FE' : '#EDE5FE')};
  box-shadow: ${({ selected }) =>
    selected ? `0 0 0 1px var(--ai-purple-80-sub) inset` : `0 0 0 1px transparent inset`};
`;

const InnerWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const ItemWrapper = styled.div<{ selected: boolean }>`
  text-align: left;
  width: 100%;

  & > p:nth-child(1) {
    font-size: 16px;
    font-weight: ${({ selected }) => (selected ? 700 : 500)};
    color: ${({ selected }) => (selected ? '#6F3AD0' : '#454c53')};
  }

  & > p:nth-child(2) {
    font-size: 12px;
    color: ${({ selected }) => (selected ? '#6F3AD0' : '#72787f')};
    font-weight: ${({ selected }) => (selected ? 700 : 500)};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export { IconWrapper, InnerWrapper, ItemWrapper, StyledButton };
