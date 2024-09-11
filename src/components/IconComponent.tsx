import styled, { css } from 'styled-components';

import { IconSize, SIZES } from './Icon';

interface IconComponentProps {
  iconSize?: IconSize;
  iconComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const IconSizeStyle = css<{ size: IconSize }>`
  ${(props) => SIZES[props.size]}
`;

const WrappedSvg = styled.div`
  ${IconSizeStyle}

  pointer-events: none;
`;

const IconComponent = (props: IconComponentProps) => {
  const { iconSize = 'sm', iconComponent } = props;

  return <WrappedSvg size={iconSize} as={iconComponent}></WrappedSvg>;
};

export default IconComponent;
