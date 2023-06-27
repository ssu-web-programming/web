import Icon from './Icon';
import icon_recreating from '../img/ico_back.svg';
import styled from 'styled-components';
import { alignItemCenter, flex, justiCenter } from '../style/cssCommon';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  ${flex}
  ${alignItemCenter}
  
  font-size: 12px;
  color: var(--gray-gray-80-02);
  cursor: pointer;

  height: 26px;
  line-height: 100%;
`;

const Contents = styled.div`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}
  gap: 4px;
`;

const RecreatingButton = ({ onClick }: { onClick: Function }) => {
  const { t } = useTranslation();
  return (
    <Wrapper
      onClick={() => {
        onClick();
      }}>
      <Contents>
        <Icon size="sm" iconSrc={icon_recreating} />
        {t(`WriteTab.ReEnterTopic`)}
      </Contents>
    </Wrapper>
  );
};

export default RecreatingButton;
