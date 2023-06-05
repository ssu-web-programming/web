import Button from './Button';
import { CSSProp, css } from 'styled-components';
import icon_stop from '../img/ico_stop.svg';
import Icon from './Icon';
import { alignItemCenter, flex, justiCenter } from '../style/cssCommon';

const StopButton = ({ onClick, cssExt }: { onClick: Function; cssExt?: CSSProp }) => {
  return (
    <Button
      cssExt={css`
        width: 73px;
        height: 28px;
        border-radius: 4px;
        background-color: #fff;
        box-sizing: border-box;
        ${flex}
        ${alignItemCenter}
        ${justiCenter}
        line-height: 100%;

        font-size: 13px;
        color: #2f3133;
        flex: none;
        ${cssExt && cssExt}
      `}
      onClick={() => {
        onClick();
      }}>
      <Icon
        iconSrc={icon_stop}
        cssExt={css`
          width: 16px;
          height: 16px;
          margin-right: 4px;
        `}
      />
      Stop
    </Button>
  );
};

export default StopButton;
