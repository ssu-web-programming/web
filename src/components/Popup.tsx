import { useSelector } from 'react-redux';
import { useAppDispatch } from 'store/store';
import styled from 'styled-components';
import { initPopup, selectPopup } from 'store/slices/popupSlice';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0000004d;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  box-shadow: 0px 4px 12px 0px #00000033;
`;

const PopupWrapper = styled.div`
  max-width: 343px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  // animation: fadeIn 0.3s ease;
`;

const Header = styled.div`
  padding: 24px 24px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  line-height: 30px;
`;

const Content = styled.div`
  padding: 0 24px;
`;

const Footer = styled.div`
  padding: 36px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const BUTTON_STYLE = {
  confirm: {
    'background-color': 'var(--ai-purple-50-main)',
    color: 'white'
  },
  close: {
    'background-color': 'var(--gray-gray-20)',
    color: 'var(--gray-gray-90-01)'
  }
};

// 임시 버튼
const Button = styled.button<{ confirm?: boolean }>`
  ${(props) => BUTTON_STYLE[props.confirm ? 'confirm' : 'close']}
  min-width: 50%;
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
  border: none;
  cursor: pointer;
  border-radius: 8px;

  font-size: 16px;
  font-weight: 500;
  line-height: 24px;

  &:hover {
    opacity: 0.8;
  }
`;

const Popup = () => {
  const dispatch = useAppDispatch();
  const popup = useSelector(selectPopup);

  // const cloaseModal = () => {
  //   dispatch(initModal());
  // };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(initPopup());
    }
  };

  if (popup.title === '') return null;

  return (
    <Overlay onClick={handleOverlayClick}>
      <PopupWrapper>
        <Header>
          <Title>{popup.title}</Title>
        </Header>
        <Content>{popup.contents}</Content>
        <Footer>
          {popup.onClose && <Button onClick={popup.onClose}>{popup.closeText}</Button>}
          {popup.onConfirm && (
            <Button onClick={popup.onConfirm} confirm>
              {popup.confirmText}
            </Button>
          )}
        </Footer>
      </PopupWrapper>
    </Overlay>
  );
};

export default Popup;
