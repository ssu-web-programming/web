import { css } from 'styled-components';
import Button, { ButtonProps } from './Button';

export const noBorderBtnCss = (selected?: boolean) => {
  return css`
    box-shadow: ${selected
      ? '0 0 0 1px var(--ai-purple-80-sub) inset'
      : '0 0 0 1px transparent inset'};
  `;
};

const NoBorderButton = (props: React.PropsWithChildren<ButtonProps>) => {
  const { cssExt, selected } = props;
  return (
    <Button
      {...props}
      cssExt={css`
        ${cssExt}
        ${noBorderBtnCss(selected)}
      `}
    />
  );
};

export default NoBorderButton;
