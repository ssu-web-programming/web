import { ButtonHTMLAttributes, FunctionComponent, SVGProps } from 'react';
import { themeInfoSelector } from 'store/slices/theme';
import { useAppSelector } from 'store/store';
import styled from 'styled-components';

type SVGComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

interface ControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: SVGComponent;
  darkIcon: SVGComponent;
  width?: number;
  height?: number;
}

export default function ControlButton({
  icon: Icon,
  darkIcon: DarkIcon,
  width = 64,
  height = 64,
  onClick,
  ...props
}: ControlButtonProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const ButtonIcon = isLightMode ? Icon : DarkIcon;

  return (
    <S.StyledButton onClick={onClick} {...props}>
      <ButtonIcon width={width} height={height} />
    </S.StyledButton>
  );
}

const S = {
  StyledButton: styled.button`
    background: transparent;
    cursor: pointer;
  `
};
