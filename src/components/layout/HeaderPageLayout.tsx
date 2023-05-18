import styled, { css } from 'styled-components';
import Wrapper from '../Wrapper';
import Icon from '../Icon';
import icon_ai from '../../img/ico_ai.svg';
import icon_ai_close from '../../img/ico_ai_close.svg';
import badge_beta from '../../img/badge_beta_ai.svg';
import {
  flexColumn,
  flex,
  flexGrow,
  alignItemCenter,
  justiSpaceBetween,
  flexShrink
} from '../../style/cssCommon';

const Contents = styled.div`
  width: 100%;
  height: 100%;
  ${flexColumn}
`;

const Header = styled.div`
  padding: 8px 5px 8px 10px;
  height: 48px;
  ${justiSpaceBetween}
`;

const Body = styled.div`
  /* flex: 1; */
  ${flexGrow}
  ${flexShrink}

  overflow: hidden;
`;

const TitleWrapper = styled.div`
  ${alignItemCenter}

  width: fit-content;
`;

const Title = styled.div`
  ${flex}

  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--ai-purple-50-main);
`;

const SubTitle = styled.div`
  ${flex}

  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #282828;
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  margin: 0px 12px 0px 12px;
  background-color: #b1b6bb;
`;

export default function HeaderPageLayout({
  title,
  subTitle,
  children,
  tabComp
}: {
  title: string;
  subTitle: string;
  children: React.ReactNode;
  tabComp?: React.ReactNode;
}) {
  return (
    <Wrapper>
      <Contents>
        <Header>
          <TitleWrapper>
            <Icon
              iconSrc={icon_ai}
              cssExt={css`
                width: 32px;
                height: 32px;
                margin: 0 4px 0 0;
                padding: 1px 2px 3px;
              `}
            />
            <Title>{title}</Title>
            <Icon
              iconSrc={badge_beta}
              cssExt={css`
                width: 34px;
                height: 16px;
                margin: 9px 0px 7px 7px;
              `}
            />
            {subTitle && (
              <>
                <Divider /> <SubTitle>{subTitle}</SubTitle>
              </>
            )}
          </TitleWrapper>
          <Icon
            iconSrc={icon_ai_close}
            cssExt={css`
              width: 32px;
              height: 32px;
              padding: 10.8px 10.8px 10.8px 10.8px;
            `}
            onClick={() => window._Bridge.closePanel()}
          />
        </Header>
        {tabComp && tabComp}
        <Body>{children}</Body>
      </Contents>
    </Wrapper>
  );
}
