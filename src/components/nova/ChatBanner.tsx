import styled from 'styled-components';
import { SvgIcon, SvgIconProps } from '@mui/material';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {
  alignItemCenter,
  flex,
  flexColumn,
  justiSpaceBetween,
  justiStart
} from '../../style/cssCommon';
import { ReactComponent as ExpandMoreSvg } from 'img/nova/promotion/expand_more_purple.svg';
import flag from 'img/nova/promotion/flag.svg';

import { useTranslation } from 'react-i18next';
import { Heart } from './Heart';
import { useAppSelector } from '../../store/store';
import { IPromotionUserInfo, userInfoSelector } from '../../store/slices/promotionUserInfo';

const ExpandMoreIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <ExpandMoreSvg />
  </SvgIcon>
);

const Wrap = styled.div`
  width: 100%;
  position: absolute;
  top: 24px;
  padding: 0 16px;
`;

const StyledAccordion = styled(Accordion)`
  &.MuiAccordion-root,
  &.MuiAccordion-root.Mui-expanded {
    box-shadow: none;
    border: 1px solid #c6a9ff;
    border-radius: 8px !important;
    background-color: #f5f1fd;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  &.MuiAccordionSummary-root,
  &.MuiAccordionSummary-root.Mui-expanded {
    min-height: 48px;
  }

  .MuiAccordionSummary-content,
  .MuiAccordionSummary-content.Mui-expanded {
    margin: 0;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  &.MuiAccordionDetails-root {
    padding: 16px 16px 24px;
  }
`;

const StyledDriver = styled(Divider)`
  &.MuiDivider-root {
    margin: 0 16px;
    border-color: #e8ebed;
  }
`;

const Header = styled.div`
  ${flex}
  ${alignItemCenter}
  ${justiStart}
  gap: 4px;

  span {
    font-size: 16px;
    font-weight: 700;
    line-height: 16px;
    color: #6f3ad0;
  }
`;

const Content = styled.div`
  ${flex}
  ${justiSpaceBetween}
`;

const TextWrap = styled.div`
  ${flex}
  ${flexColumn}

  gap: 8px;
  border-top: 1px solid #e8ebed;
  span.header {
    font-size: 16px;
    font-weight: 700;
    line-height: 16px;
    color: #511bb2;
  }
  span.desc {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: rgba(62, 15, 141, 0.6);
    white-space: break-spaces;
  }
`;

export const ChatBanner = () => {
  const { t } = useTranslation();
  const userInfo: IPromotionUserInfo = useAppSelector(userInfoSelector);

  return (
    <Wrap>
      <StyledAccordion>
        <StyledAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header">
          <Header>
            <img src={flag} alt="flag" />
            <span>{t('Nova.ChatBanner.Header.Title')}</span>
          </Header>
        </StyledAccordionSummary>
        <StyledDriver />
        <StyledAccordionDetails>
          <Content>
            <TextWrap>
              <span className="header">{t('Nova.ChatBanner.Content.Title')}</span>
              <span className="desc">{t('Nova.ChatBanner.Content.Desc')}</span>
            </TextWrap>
            <Heart progress={userInfo.point} iconWidth={64} iconHeight={57} />
          </Content>
        </StyledAccordionDetails>
      </StyledAccordion>
    </Wrap>
  );
};
