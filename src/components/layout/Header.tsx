import styled, { css } from 'styled-components';
import Icon from '../Icon';
import icon_ai from '../../img/ico_ai.svg';
import icon_ai_close from '../../img/ico_ai_close.svg';
import badge_beta from '../../img/badge_beta_ai.svg';
import { flex, alignItemCenter, justiSpaceBetween } from '../../style/cssCommon';

const Contents = styled.div`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  
  padding-left: 10px;
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
  font-stretch: normal;
  font-style: normal;
  line-height: 100%;
  letter-spacing: normal;
  color: var(--ai-purple-50-main);
  margin: 3px 7px 5px 4px;
  padding: 0;
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
        <Icon
          iconSrc={icon_ai}
          cssExt={css`
            width: 32px;
            height: 32px;
            object-fit: contain;
          `}
        />
        <Title>{title}</Title>
        <Icon
          iconSrc={badge_beta}
          cssExt={css`
            width: 34px;
            height: 16px;
            margin: 9px 0px 7px 0px;
            object-fit: contain;
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
          margin-right: 5px;
        `}
        onClick={() => window._Bridge.closePanel()}
      />
    </Contents>
  );
}
