import styled from 'styled-components';
import Dim from './Dim';
import { useAppDispatch, useAppSelector } from '../store/store';
import { initConfirm, selectConfirm } from '../store/slices/confirm';
import {
  alignItemCenter,
  flex,
  flexColumn,
  flexGrow,
  flexShrink,
  justiCenter,
  purpleBtnCss
} from '../style/cssCommon';
import error_icon from '../img/service_error.png';
import close_icon from '../img/ico_ai_close.svg';
import { useTranslation } from 'react-i18next';

const ConfirmBox = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  ${flexColumn}
  background-color: #fff;

  /* width: 348px; */
  width: 90%;
  height: 200px;

  border-radius: 2px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px #a3a3a3;

  border-radius: 4px;
  border: solid 1px var(--gray-gray-50);
  background-color: #fff;
  box-sizing: border-box;

  ${flexGrow}
  ${flexShrink}
  ${alignItemCenter}
  ${justiCenter}
`;

const CloseBtn = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  ${flex}

  img {
    width: 32px;
    height: 32px;
  }

  ${justiCenter}
  ${alignItemCenter}
  align-self: flex-end;
  &:hover {
    cursor: pointer;
  }
`;

const MsgArea = styled.div`
  font-size: 13px;
  color: var(--gray-gray-80-02);
  margin: 18px 0px 24px 0px;

  height: fit-content;
  ${flexColumn}
  ${flexGrow}
  ${justiCenter}
  ${alignItemCenter}
`;

const ContentArea = styled.div`
  ${flexColumn}
  ${justiCenter}
  ${alignItemCenter}
`;

const ErrorIcon = styled.img`
  width: 38.6px;
  height: 36px;
`;

const RetryBtn = styled.button`
  ${purpleBtnCss}
  padding: 0px;

  height: 28px;
  border-radius: 4px;

  ${flex}
  ${alignItemCenter}
  ${justiCenter}
  ${flexGrow}
  ${flexShrink}
  margin: 0px 16px 0px 16px;
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
  }
`;

const Confirm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { msg, btnFunc, active } = useAppSelector(selectConfirm);

  const close = () => {
    dispatch(initConfirm());
  };

  return (
    <>
      {active && (
        <>
          <Dim />
          <ConfirmBox>
            <CloseBtn onClick={close}>
              <img src={close_icon} />
            </CloseBtn>
            <ContentArea>
              <ErrorIcon src={error_icon} />
              <MsgArea className="msgarea">{msg}</MsgArea>
            </ContentArea>
            {btnFunc && (
              <div style={{ width: '100%', display: 'flex' }}>
                <RetryBtn
                  onClick={() => {
                    btnFunc();
                  }}>
                  {t(`Retry`)}
                </RetryBtn>
              </div>
            )}
          </ConfirmBox>
        </>
      )}
    </>
  );
};

export default Confirm;
