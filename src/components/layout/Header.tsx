import styled from 'styled-components';
import Icon from '../Icon';
import icon_ai from '../../img/ico_ai.svg';
import icon_ai_close from '../../img/ico_ai_close.svg';
import badge_beta from '../../img/badge_beta_ai.svg';
import { flex, alignItemCenter, justiSpaceBetween } from '../../style/cssCommon';
import Bridge from '../../util/bridge';
import IconButton from '../buttons/IconButton';

const Contents = styled.div`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  
  padding: 8px 5px 8px 10px;
  height: 48px;
`;

const TitleWrapper = styled.div`
  ${flex}
  ${alignItemCenter}
  /* line-height: 100%; */
  width: fit-content;
`;

const Title = styled.div`
  ${flex}

  font-size: 16px;
  font-weight: bold;
  line-height: 100%;
  color: var(--ai-purple-50-main);
  margin: 3px 7px 5px 4px;
  padding: 0;
`;

const SubTitle = styled.div`
  ${flex}

  font-size: 14px;
  font-weight: normal;
  color: #282828;
  margin: 6px 0 6px 0px;
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  margin: 7px 12px 5px;
  background-color: #b1b6bb;
`;

interface HeaderProps {
  title: string;
  subTitle: string;
}

export default function Header(props: HeaderProps) {
  const { title, subTitle } = props;
  return (
    <Contents>
      <TitleWrapper>
        <Icon iconSrc={icon_ai} size="lg" />
        <Title>{title}</Title>
        <img src={badge_beta} alt="Beta" />
        {subTitle && (
          <>
            <Divider /> <SubTitle>{subTitle}</SubTitle>
          </>
        )}
      </TitleWrapper>
      <IconButton
        iconSrc={icon_ai_close}
        iconSize="lg"
        onClick={() => Bridge.callBridgeApi('closePanel', '')}
      />
    </Contents>
  );
}
