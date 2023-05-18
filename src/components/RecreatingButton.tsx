import Icon from './Icon';
import icon_recreating from '../img/ico_recreating.svg';
import styled, { css } from 'styled-components';
import { flex } from '../style/cssCommon';

const Wrapper = styled.div`
  ${flex}
  font-size: 12px;
  color: var(--gray-gray-80-02);
  align-items: center;
  cursor: pointer;
`;

const RecreatingButton = ({ onClick }: { onClick: Function }) => {
  return (
    <Wrapper
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
    </Wrapper>
  );
};

export default RecreatingButton;
