import styled from 'styled-components';
import Icon from '../Icon';
import icon_ai from '../../img/ico_ai.svg';
import { flex, alignItemCenter, justiSpaceBetween } from '../../style/cssCommon';
import Bridge from '../../util/bridge';
import IconButton from '../buttons/IconButton';

import { ReactComponent as IconClose } from '../../img/ico_ai_close.svg';

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
  margin: 3px 0px 5px 4px;
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

const CloseButtonWrap = styled.div`
  color: #3c3c3c;
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
        {subTitle && (
          <>
            <Divider /> <SubTitle>{subTitle}</SubTitle>
          </>
        )}
      </TitleWrapper>
      <CloseButtonWrap>
        <IconButton
          iconComponent={IconClose}
          iconSize="lg"
          onClick={() => Bridge.callBridgeApi('closePanel', '')}
        />
      </CloseButtonWrap>
    </Contents>
  );
}
