import { css } from 'styled-components';
import { alignItemCenter, flex, justiCenter } from '../../style/cssCommon';
import Icon from '../Icon';
import icon_sand from '../../img/ico_send.svg';
import icon_credit from '../../img/ico_credit.svg';
import Button from './Button';

const SendCoinButton = ({
  onClick = () => {},
  disabled = false
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <Button
      height={32}
      width={40}
      disable={disabled}
      onClick={() => {
        onClick();
      }}
      cssExt={css`
        ${flex}
        ${alignItemCenter}
        ${justiCenter}
        align-self: flex-end;
        position: relative;

        box-sizing: border-box;
        border-radius: 4px;
        border: none;
        background-image: linear-gradient(to left, #a86cea, #6f3ad0 100%);
        padding: 6px 10px;
        margin: 0px 8px 8px 0px;
      `}>
      <Icon iconSrc={icon_sand} size="md" />
      <Icon
        iconSrc={icon_credit}
        size={14}
        cssExt={css`
          position: absolute;
          bottom: 3px;
          right: 4px;
        `}
      />
    </Button>
  );
};

export default SendCoinButton;
