import styled, { css } from 'styled-components';

import { IconSize, SIZES } from '../Icon';

import Button from './Button';

interface AskDocButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
  iconSize?: IconSize;
  iconComponent?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
}

const AskDocButton = (props: AskDocButtonProps) => {
  const { onClick, text, iconSize, iconComponent, isActive = true } = props;

  return (
    <Button
      height={40}
      onClick={onClick}
      cssExt={css`
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        position: relative;
        background: ${isActive
          ? 'linear-gradient(to left, #a86cea, var(--ai-purple-50-main))'
          : '#f2f4f6'};

        color: ${isActive ? 'white' : 'black'};
      `}>
      <div>{text}</div>
      {iconComponent && (
        <WrappedSvg size={iconSize ? iconSize : 'sm'} as={iconComponent}></WrappedSvg>
      )}
    </Button>
  );
};

export default AskDocButton;

const IconSizeStyle = css<{ size: IconSize }>`
  ${(props) => SIZES[props.size]}
  position: absolute;
  right: 12px;
`;

const WrappedSvg = styled.div`
  ${IconSizeStyle}
`;
