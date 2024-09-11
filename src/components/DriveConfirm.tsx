import { useEffect, useRef } from 'react';
import { ConfirmBox, ContentArea, Footer, Header } from 'components/Confirm';
import styled, { css } from 'styled-components';

import Button from './buttons/Button';
import Blanket from './Blanket';

const Wrapper = styled(ConfirmBox)`
  position: fixed;
  margin: auto;
  height: 506px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  line-height: 30px;
`;

type DriveConfirmType = {
  title: string;
  msg: React.ReactNode | string;
  onOk: { text: string; callback: () => void; disable?: boolean };
  onCancel?: { text: string; callback: () => void };
  direction?: 'column' | 'row';
};

const DriveConfirm = (props: DriveConfirmType) => {
  const { title, msg, onOk, onCancel, direction = 'row' } = props;
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

  const HEIGHT_BY_DIRECTION = direction === 'column' ? 40 : 48;

  if (!msg) return null;

  return (
    <>
      <Blanket />
      <Wrapper>
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
              line-height: 19px;
            `}
            disable={onOk.disable}>
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
                line-height: 19px;
              `}>
              {onCancel.text}
            </Button>
          )}
        </Footer>
      </Wrapper>
    </>
  );
};

export default DriveConfirm;
