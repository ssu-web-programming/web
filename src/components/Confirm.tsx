import styled from 'styled-components';
import Blanket from './Blanket';
import { useAppDispatch, useAppSelector } from '../store/store';
import { activeConfirm, ConfirmType, initConfirm, selectConfirm } from '../store/slices/confirm';
import Button from './buttons/Button';

const ConfirmBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 320px;
  box-shadow: 0px 8px 16px 0px #0000001a;
  border-radius: 10px;
  padding: 24px;
  background-color: #ffffff;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  margin-bottom: 24px;

  & .important {
    color: red;
    font-weight: 700;
  }
`;

const Confirm = () => {
  const { msg, onOk, onCancel } = useAppSelector(selectConfirm);

  if (!msg) return null;

  return (
    <>
      <Blanket />
      <ConfirmBox>
        <ContentArea>{msg}</ContentArea>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button variant="purpleGradient" width={'full'} height={40} onClick={onOk.callback}>
            {onOk.text}
          </Button>
          <Button variant="gray" width={'full'} height={40} onClick={onCancel?.callback}>
            {onCancel.text}
          </Button>
        </div>
      </ConfirmBox>
    </>
  );
};

export default Confirm;

export function useConfirm() {
  const dispatch = useAppDispatch();
  return function ({ msg, onOk, onCancel }: ConfirmType) {
    return new Promise((resolve) => {
      dispatch(
        activeConfirm({
          msg,
          onOk: {
            text: onOk.text,
            callback: () => {
              dispatch(initConfirm());
              resolve(true);
            }
          },
          onCancel: {
            text: onCancel.text,
            callback: () => {
              dispatch(initConfirm());
              resolve(false);
            }
          }
        })
      );
    });
  };
}
