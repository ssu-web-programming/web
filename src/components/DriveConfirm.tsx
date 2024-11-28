import { useEffect, useRef } from 'react';
import { ContentArea, Footer, Header } from 'components/Confirm';
import styled, { css } from 'styled-components';
import { isMobile } from 'util/bridge';

// import icBack from '../img/ico_back.svg';
import icBack from '../img/ico_arrow_left.svg';
import icClose from '../img/ico_nova_close.svg';

import Button from './buttons/Button';
import Blanket from './Blanket';
import Icon from './Icon';

const ConfirmBox = styled.div<{
  $isMobile: boolean;
}>`
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
  max-width: ${({ $isMobile }) => ($isMobile ? '100%' : '343px')};
  box-shadow: 0px 8px 16px 0px #0000001a;
  background-color: #fff;
  border-radius: ${({ $isMobile }) => ($isMobile ? '0px' : '10px')};
  z-index: 100;
  max-height: 100vh;
  height: fit-content;
`;

const Wrapper = styled(ConfirmBox)<{
  $isMobile: boolean;
}>`
  position: fixed;
  margin: auto;
  height: ${({ $isMobile }) => ($isMobile ? '100%' : '506px')};
`;

const Title = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 24px;
`;
const MobileHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
      <Wrapper $isMobile={isMobile}>
        <Header ref={headerRef}>
          {/* 모바일에서는 뒤로가기 버튼 , 웹에서는 X버튼을 만족시켜야함! */}
          {isMobile ? (
            <MobileHeaderContainer>
              <Icon size={16} iconSrc={icBack} onClick={onCancel?.callback} />
              <Title>{title}</Title>
            </MobileHeaderContainer>
          ) : (
            <HeaderContainer>
              <Title>{title}</Title>
              <Icon size={32} iconSrc={icClose} onClick={onCancel?.callback} />
            </HeaderContainer>
          )}
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
