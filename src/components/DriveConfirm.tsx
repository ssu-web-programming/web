import { useEffect, useRef } from 'react';
import { ConfirmBox, ContentArea, Footer, Header } from 'components/Confirm';
import styled, { css } from 'styled-components';

import icClose from '../img/ico_ai_close.svg';

import Button from './buttons/Button';
import Blanket from './Blanket';
import Icon from './Icon';

const Wrapper = styled(ConfirmBox)`
  position: fixed;
  margin: auto;
  height: 506px;
`;

const Title = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 24px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > img {
    cursor: pointer;
  }
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
          <HeaderContainer>
            <Title>{title}</Title>
            <Icon size={32} iconSrc={icClose} onClick={onCancel?.callback} />
          </HeaderContainer>
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
        </Footer>
      </Wrapper>
    </>
  );
};

export default DriveConfirm;
