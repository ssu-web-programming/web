import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

const StyledButton = styled.button<{
  selected: boolean;
  buttonStyle?: FlattenSimpleInterpolation;
  hideSelectedStyles?: boolean;
}>`
  width: 100%;
  padding: 8px 16px;
  border-radius: 8px;

  ${({ selected, hideSelectedStyles }) =>
    hideSelectedStyles
      ? css`
          background: transparent;
        `
      : css`
          background: ${selected ? '#EDE5FE' : '#F2F4F6'};
          box-shadow: ${selected
            ? `0 0 0 1px var(--ai-purple-90) inset`
            : `0 0 0 1px transparent inset`};
        `}

  ${({ buttonStyle }) => buttonStyle && buttonStyle}
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
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;

  & span {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: #26282b;
  }
`;

const FreeBadge = styled.div`
  min-width: 33px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    var(--primary-po-blue-45) 0%,
    var(--primary-po-purple-45) 100%
  );

  span {
    font-size: 12px;
    font-weight: 600;
    color: white;
  }
`;

export { FreeBadge, IconWrapper, InnerWrapper, ItemWrapper, StyledButton };
