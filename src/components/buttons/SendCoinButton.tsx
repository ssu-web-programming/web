import styled, { css } from 'styled-components';

import icon_credit from '../../img/ico_credit.svg';
import icon_sand from '../../img/ico_send.svg';
import Icon from '../Icon';

import Button from './Button';

const CoinIcon = styled.div`
  display: flex;
  position: absolute;
  bottom: 3px;
  right: 4px;
`;

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
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: flex-end;
        position: relative;

        border-radius: 4px;
        background-image: linear-gradient(to left, #a86cea, #6f3ad0 100%);
        padding: 6px 10px;
        margin: 0px 8px 8px 0px;
      `}>
      <Icon iconSrc={icon_sand} size="md" />
      <CoinIcon>
        <Icon iconSrc={icon_credit} size={14} />
      </CoinIcon>
    </Button>
  );
};

export default SendCoinButton;
