import styled, { css } from 'styled-components';

import { IconSize, SIZES } from '../Icon';

import Button, { ButtonProps } from './Button';

export const IconSizeStyle = css<{ size: IconSize }>`
  ${(props) => SIZES[props.size]}
`;

const WrappedSvg = styled.div`
  ${IconSizeStyle};

  pointer-events: none;
`;

export interface IconButtonProps extends ButtonProps {
  iconSize?: IconSize;
  iconComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const IconButton = (props: React.PropsWithChildren<IconButtonProps>) => {
  const { width, height, cssExt, iconSize = 'sm' } = props;

  return (
    <Button
      variant="none"
      width={width ? width : 'fit'}
      height={height ? height : 'fit'}
      cssExt={css`
        padding: 0;
        margin: 0;
        ${cssExt}
      `}
      {...props}>
      <WrappedSvg size={iconSize} as={props.iconComponent}></WrappedSvg>
    </Button>
  );
};

export default IconButton;
