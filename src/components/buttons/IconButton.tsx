import { FlattenSimpleInterpolation, css } from 'styled-components';
import Icon, { IconSize } from '../Icon';
import Button, { ButtonBorderType, ButtonSize, ButtonVariant } from './Button';

const IconButton = (
  props: React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    selected?: boolean;
    buttonWidth?: ButtonSize | number;
    buttonHeight?: number | 'fit';
    variant?: ButtonVariant;
    borderType?: ButtonBorderType;
    buttonCssExt?: FlattenSimpleInterpolation;
    disable?: boolean;
    iconSize?: IconSize | number;
    iconSrc: string;
  }>
) => {
  const { children } = props;
  const { buttonWidth, buttonHeight, buttonCssExt, iconSize } = props;

  return (
    <Button
      variant="transparent"
      width={buttonWidth ? buttonWidth : 'fit'}
      height={buttonHeight ? buttonHeight : 'fit'}
      cssExt={css`
        padding: 0px;
        margin: 0px;
        ${buttonCssExt}
      `}
      {...props}>
      <Icon size={iconSize} {...props} />
      {children}
    </Button>
  );
};

export default IconButton;
