import Icon from './Icon';
import icon_copy from '../img/ico_copy.svg';
import { CSSProp } from 'styled-components';

const CopyIcon = ({ onClick, cssExt }: { onClick: Function; cssExt?: CSSProp }) => {
  return (
    <Icon
      iconSrc={icon_copy}
      cssExt={cssExt}
      onClick={(e: React.MouseEvent) => {
        //TODO: 복사 로직
        onClick(e);
      }}
    />
  );
};

export default CopyIcon;
