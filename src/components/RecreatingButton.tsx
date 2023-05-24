import Icon from './Icon';
import icon_recreating from '../img/ico_recreating.svg';
import styled, { css } from 'styled-components';
import { alignItemCenter, flex } from '../style/cssCommon';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  ${flex}
  font-size: 12px;
  color: var(--gray-gray-80-02);
  ${alignItemCenter}
  cursor: pointer;

  height: 26px;
  line-height: 100%;
`;

const RecreatingButton = ({ onClick }: { onClick: Function }) => {
  const { t } = useTranslation();
  return (
    <Wrapper
      onClick={() => {
        onClick();
      }}>
      <Icon
        cssExt={css`
          width: 16px;
          height: 16px;
          margin-right: 4px;
        `}
        iconSrc={icon_recreating}
      />
      {t(`WriteTab.ReEnterTopic`)}
    </Wrapper>
  );
};

export default RecreatingButton;
