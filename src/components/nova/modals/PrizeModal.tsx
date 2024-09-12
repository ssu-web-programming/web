import { useRef, useState } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import TextField from '@mui/material/TextField';
import { ReactComponent as ExpandMoreSvg } from 'img/nova/promotion/expand_more_gray.svg';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { apiWrapper } from '../../../api/apiWrapper';
import { PROMOTION_AGREE } from '../../../api/constant';
import AmericanoIcon from '../../../img/nova/promotion/prize_americano.svg';
import BuzIcon from '../../../img/nova/promotion/prize_buz.svg';
import IPadIcon from '../../../img/nova/promotion/prize_ipad.svg';
import {
  IAccurePromotionAction,
  IEventType,
  IPromotionUserInfo,
  userInfoSelector
} from '../../../store/slices/nova/promotionUserInfo';
import { useAppSelector } from '../../../store/store';

const ExpandMoreIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <ExpandMoreSvg />
  </SvgIcon>
);

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  background-color: #fff;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
`;

const ContentTop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
`;

const ContentBottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  margin-top: 12px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: #3e0f8d;
`;

const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.5px;
  color: #454c53;
  margin-top: 12px;
`;

const Desc = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 19.6px;
  letter-spacing: -0.5px;
  color: #9ea4aa;
  margin-top: 4px;
`;

const Img = styled.img`
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
  margin-top: 24px;
`;

const InputBoxWrap = styled.div`
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputBox = styled(TextField)`
  input {
    padding: 12px 16px;
    font-size: 16px;
    font-family: Pretendard, sans-serif;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.5px;
    color: #454c53;
  }

  legend {
    display: none;
  }

  .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    height: 48px;
    top: 0;
    border-color: #e8ebed !important;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #6f3ad0 !important;
    border-width: 1px;
  }
`;

const Error = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: -0.5px;
  margin-left: 12px;
  margin-top: -4px;
  color: #fb4949;
`;

const Button = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  background-color: #6f3ad0;
  cursor: pointer;
  margin: 24px 0;

  span {
    font-size: 18px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: -0.5px;
    color: #fff;
  }
`;

const StyledAccordion = styled(Accordion)`
  width: 100%;

  &.MuiAccordion-root,
  &.MuiAccordion-root.Mui-expanded {
    margin: 0;
    box-shadow: none;
    border: none;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    background-color: #f2f4f6;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  &.MuiAccordionSummary-root {
    min-height: 24px;
    padding: 16px 24px;
  }

  &.MuiAccordionSummary-root.Mui-expanded {
    min-height: 24px;
    padding: 16px 24px 0 24px;
  }

  .MuiAccordionSummary-content,
  .MuiAccordionSummary-content.Mui-expanded {
    margin: 0;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  &.MuiAccordionDetails-root {
    padding: 8px 63px 16px 24px;
  }
`;

const AccordionTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  letter-spacing: -0.5px;
  color: #26282b;
`;

const StyledUl = styled.ul`
  padding-left: 17px;
`;

const StyledLi = styled.li`
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: -0.5px;
  color: #454c53;
`;

type Props = {
  buttonOnClick: () => void;
};

const PrizeModal = ({ buttonOnClick }: Props) => {
  const userInfo: IPromotionUserInfo = useAppSelector(userInfoSelector);
  const { t } = useTranslation();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [nameErrMsg, setNameErrMsg] = useState('');
  const [namePhoneMsg, setPhoneErrMsg] = useState('');

  const submitInfo = async () => {
    const nameValue = nameRef.current?.value;
    const phoneValue = phoneRef.current?.value;

    if (!nameValue) {
      setNameErrMsg(t('Nova.Modal.Prize.Input.Name') as string);
    } else {
      setNameErrMsg('');
    }

    if (!phoneValue) {
      setPhoneErrMsg(t('Nova.Modal.Prize.Input.Phone') as string);
    } else {
      setPhoneErrMsg('');
    }

    if (nameValue && phoneValue) {
      const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
      await apiWrapper().request(PROMOTION_AGREE, {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          type: eventType,
          name: nameValue,
          phoneNumber: phoneValue
        }),
        method: 'POST'
      });

      buttonOnClick();
    }
  };

  const getPromotionPrize = () => {
    const prize = userInfo.accureAction[userInfo.accureAction.length - 1];
    if (prize === IAccurePromotionAction.WIN_STARBUCK_COUPON) {
      return <Img src={AmericanoIcon} alt="credit" width="72px" height="130px" />;
    } else if (prize === IAccurePromotionAction.WIN_BUZ) {
      return <Img src={BuzIcon} alt="credit" width="130px" height="130px" />;
    } else if (prize === IAccurePromotionAction.WIN_IPAD) {
      return <Img src={IPadIcon} alt="credit" width="112px" height="130px" />;
    } else {
      return <></>;
    }
  };

  return (
    <Wrap>
      <ContentWrap>
        <ContentTop>
          <Title>{t('Nova.Modal.Prize.Title')}</Title>
          <SubTitle>{t('Nova.Modal.Prize.SubTitle')}</SubTitle>
          <Desc>{t('Nova.Modal.Prize.Desc')}</Desc>
          {getPromotionPrize()}
        </ContentTop>
        <ContentBottom>
          <InputBoxWrap>
            <InputBox
              inputRef={nameRef}
              InputProps={{
                inputProps: {
                  placeholder: t('Nova.Modal.Prize.Input.Name') as string
                }
              }}
            />
            {nameErrMsg && <Error>{nameErrMsg}</Error>}
            <InputBox
              inputRef={phoneRef}
              InputProps={{
                inputProps: {
                  placeholder: t('Nova.Modal.Prize.Input.Phone') as string
                }
              }}
            />
            {namePhoneMsg && <Error>{namePhoneMsg}</Error>}
          </InputBoxWrap>
          <Button onClick={submitInfo}>
            <span>{t('Nova.Modal.Prize.ButtonText')}</span>
          </Button>
        </ContentBottom>
      </ContentWrap>
      <StyledAccordion>
        <StyledAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header">
          <AccordionTitle>{t('Nova.Modal.Prize.PrivateInfo.Title')}</AccordionTitle>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <StyledUl>
            <StyledLi>{t('Nova.Modal.Prize.PrivateInfo.Content1')}</StyledLi>
            <StyledLi>{t('Nova.Modal.Prize.PrivateInfo.Content2')}</StyledLi>
            <StyledLi>{t('Nova.Modal.Prize.PrivateInfo.Content3')}</StyledLi>
          </StyledUl>
        </StyledAccordionDetails>
      </StyledAccordion>
    </Wrap>
  );
};

export default PrizeModal;
