import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

import { flex, flexColumn } from '../../style/cssCommon';

import IconTextButton, { IconTextButtonProps } from './IconTextButton';

const Wrapper = styled.div`
  ${flex};
  ${flexColumn};

  gap: 8px;
`;

const Title = styled.div<{ selected: boolean }>`
  font-size: 12px;
  font-weight: normal;
  text-align: center;

  ${({ selected }) =>
    selected
      ? css`
          color: var(--ai-purple-50-main);
          font-weight: bold;
        `
      : css`
          color: var(--gray-gray-80-02);
        `};
`;

export default function IconBoxTextButton(props: PropsWithChildren<IconTextButtonProps>) {
  const { children, selected = false, ...rest } = props;
  return (
    <Wrapper>
      <IconTextButton {...rest} selected={selected}></IconTextButton>
      <Title selected={selected}>{children}</Title>
    </Wrapper>
  );
}
