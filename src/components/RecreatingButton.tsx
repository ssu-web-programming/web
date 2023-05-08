import Icon from './Icon';
import icon_recreating from '../img/ico_recreating.svg';
import { RowBox } from '../views/AIChatTab';
import { css } from 'styled-components';

const RecreatingButton = ({ onClick }: { onClick: Function }) => {
  return (
    <RowBox
      cssExt={css`
        font-size: 12px;
        color: var(--gray-gray-80-02);
        align-items: center;
        cursor: pointer;
      `}
      onClick={() => {
        onClick();
      }}>
      <Icon
        cssExt={css`
          width: 16px;
          height: 16px;
          margin-right: 6px;
        `}
        iconSrc={icon_recreating}
      />
      주제 다시 입력하기
    </RowBox>
  );
};

export default RecreatingButton;
