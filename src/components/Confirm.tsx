import { useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Blanket from './Blanket';
import { useAppDispatch, useAppSelector } from '../store/store';
import { activeConfirm, ConfirmType, initConfirm, selectConfirm } from '../store/slices/confirm';
import Button from './buttons/Button';
import { CustomScrollbar } from 'style/cssCommon';

const ConfirmBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  min-width: 328px;
  max-width: 343px;
  padding: 24px;
  box-shadow: 0px 8px 16px 0px #0000001a;
  background-color: #fff;
  border-radius: 10px;
  z-index: 100;
  max-height: 100vh;
  height: fit-content;
`;

const Header = styled.div`
  width: 100%;
  padding-bottom: 12px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  line-height: 30px;
`;

const ContentArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  height: fit-content;
  overflow-y: auto;
  ${CustomScrollbar}

  & .important {
    color: red;
    font-weight: 700;
  }

  color: var(--gray-gray-80-02);
`;

const Footer = styled.div<{ direction?: 'column' | 'row' }>`
  width: 100%;
  padding-top: 36px;
  display: flex;
  flex-direction: ${(props) => props.direction};
  gap: 8px;

  button {
    font-size: 16px;
    font-weight: 500;
  }
`;

const Confirm = () => {
  const { title, msg, onOk, onCancel, direction = 'row' } = useAppSelector(selectConfirm);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);

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
        <Header ref={headerRef}>
          <Title>{title}</Title>
        </Header>
        <ContentArea ref={contentsRef}>{msg}</ContentArea>
        <Footer direction={direction} ref={footerRef}>
          <Button
            variant="purple"
            width={'full'}
            height={HEIGHT_BY_DIRECTION}
            onClick={onOk.callback}
            cssExt={css`
              order: ${direction === 'row' ? 2 : undefined};
              min-width: 92px;
              width: 100%;
            `}>
            {onOk.text}
          </Button>
          {onCancel && (
            <Button
              variant="gray"
              width={'full'}
              height={HEIGHT_BY_DIRECTION}
              onClick={onCancel.callback}
              cssExt={css`
                order: ${direction === 'row' ? 1 : undefined};
                min-width: 92px;
                width: 100%;
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
  const dispatch = useAppDispatch();

  return function ({
    title,
    msg,
    onOk,
    onCancel,
    direction = 'row'
  }: ConfirmType): Promise<boolean> {
    return new Promise((resolve) => {
      const handleOk = () => {
        onOk.callback();
        dispatch(initConfirm());
        resolve(true);
      };

      const handleCancel = () => {
        dispatch(initConfirm());
        resolve(false);
      };

      dispatch(
        activeConfirm({
          title,
          msg,
          direction,
          onOk: {
            text: onOk.text,
            callback: handleOk
          },
          onCancel: onCancel && {
            text: onCancel.text,
            callback: handleCancel
          }
        })
      );
    });
  };
}
