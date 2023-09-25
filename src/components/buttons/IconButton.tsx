import styled, { css } from 'styled-components';
import Button, { ButtonProps } from './Button';
import { IconSize, SIZES } from '../Icon';

export const IconSizeStyle = css<{ size: IconSize }>`
  ${(props) => SIZES[props.size]}
`;

const WrappedSvg = styled.div`
  ${IconSizeStyle}
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
        padding: 0px;
        margin: 0px;
        ${cssExt}
      `}
      {...props}>
      <WrappedSvg size={iconSize} as={props.iconComponent}></WrappedSvg>
    </Button>
  );
};

export default IconButton;
