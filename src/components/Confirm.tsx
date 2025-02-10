import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { activeConfirm, ConfirmType, initConfirm, selectConfirm } from '../store/slices/confirm';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setCookie } from '../util/common';

import Button from './buttons/Button';
import Blanket from './Blanket';
import CheckBox from './CheckBox';

export const ConfirmBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  gap: 12px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  padding: 24px;
  min-width: 328px;
  max-width: 343px;
  box-shadow: 0 8px 16px 0 #0000001a;
  background: ${({ theme }) => theme.color.background.gray05};
  border-radius: 10px;
  z-index: 100;
  max-height: 100vh;
  height: fit-content;
`;

export const Header = styled.div`
  width: 100%;
  /* padding: 14.5px 16px; */
`;

const Title = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const ContentArea = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: break-spaces;
  overflow-y: auto;

  & .important {
    color: red;
    font-weight: 700;
  }

  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.gray03};
`;

export const CheckWrap = styled.div`
  display: flex;
  margin-top: 15px;

  span {
    margin-left: 10px;
  }
`;

export const Footer = styled.div<{ direction?: 'column' | 'row' }>`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => props.direction};
  gap: 8px;
  margin-top: 24px;
  /* padding: 16px; */

  button {
    font-size: 16px;
    font-weight: 500;
  }
`;

const Confirm = () => {
  const {
    title,
    msg,
    onOk,
    onCancel,
    direction = 'row',
    neverShowAgain = false
  } = useAppSelector(selectConfirm);
  const { t } = useTranslation();
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if (headerRef.current && footerRef.current) {
      const headerHeight = headerRef.current.clientHeight;
      const footerHeight = footerRef.current.clientHeight;
      const contents = contentsRef.current;

      if (contents) {
        contents.style.height = `calc(100vh - ${headerHeight + footerHeight}px)`;
      }
    }
  }, [headerRef, footerRef]);

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  const handleOk = () => {
    if (isChecked) {
      setCookie('creditGuide', String(isChecked));
    }
    onOk?.callback?.();
  };

  const handleCancel = () => {
    if (isChecked) {
      setCookie('creditGuide', String(isChecked));
    }
    onCancel?.callback();
  };

  // 필요시 사용
  // const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (e.target === e.currentTarget) {
  //     dispatch(initConfirm());
  //   }
  // };

  const HEIGHT_BY_DIRECTION = direction === 'column' ? 40 : 48;

  if (!msg) return null;

  return (
    <>
      <Blanket />
      <ConfirmBox>
        {title && (
          <Header ref={headerRef}>
            <Title>{title}</Title>
          </Header>
        )}
        <ContentArea ref={contentsRef}>
          {msg}
          {neverShowAgain && (
            <CheckWrap onClick={handleCheck}>
              <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
              <span>{t(`DontShowAgain`)}</span>
            </CheckWrap>
          )}
        </ContentArea>
        <Footer direction={direction} ref={footerRef}>
          <Button
            variant="purple"
            width={'full'}
            height={HEIGHT_BY_DIRECTION}
            onClick={handleOk}
            cssExt={css`
              order: ${direction === 'row' ? 2 : undefined};
              min-width: 92px;
              width: 100%;
              border-radius: 8px;
              line-height: 19px;
              font-weight: 500;
              flex: 2;
            `}>
            {onOk?.text}
          </Button>
          {onCancel && (
            <Button
              variant="gray"
              width={'full'}
              height={HEIGHT_BY_DIRECTION}
              onClick={handleCancel}
              cssExt={css`
                order: ${direction === 'row' ? 1 : undefined};
                min-width: 92px;
                width: 100%;
                border-radius: 8px;
                line-height: 19px;
                font-weight: 500;
                flex: 1;
              `}>
              {onCancel.text}
            </Button>
          )}
        </Footer>
      </ConfirmBox>
    </>
  );
};

export default Confirm;

export function useConfirm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return function ({
    title = '',
    msg,
    onOk,
    onCancel,
    direction = 'row',
    neverShowAgain = false
  }: ConfirmType): Promise<boolean> {
    return new Promise((resolve) => {
      const handleOk = () => {
        onOk?.callback?.();
        dispatch(initConfirm());
        resolve(true);
      };

      const handleCancel = () => {
        onCancel?.callback();
        dispatch(initConfirm());
        resolve(false);
      };

      dispatch(
        activeConfirm({
          title,
          msg,
          direction,
          neverShowAgain,
          onOk: {
            text: onOk?.text || t('Confirm'),
            callback: handleOk
          },
          onCancel: onCancel && {
            text: onCancel.text || t('Cancel'),
            callback: handleCancel
          }
        })
      );
    });
  };
}
