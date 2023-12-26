import React from 'react';
import styled from 'styled-components';
import { alignItemCenter, flex, justiCenter } from '../../../style/cssCommon';
type IErrorModalProps = {
  title: string;
  children: React.ReactNode;
} & (TwoButtonModal | OneButtonModal);

type TwoButtonModal = {
  isTwoButton: true;
  leftButtonName: string;
  rightButtonName: string;
  leftButtonOnClick: () => void;
  rightButtonOnClick: () => void;
};

type OneButtonModal = {
  isTwoButton: false;
  buttonName: string;
  buttonOnClick: () => void;
};

const ErrorModalWrapper = styled.div`
  padding: 1.5rem;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 10px;
  & h1 {
    font-size: 1.125rem;
    line-height: 1.5;
    color: var(--gray-gray-90-01);
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  & p {
    font-size: 0.875rem;
    color: var(--gray-gray-80-02);
  }

  & button {
    width: 100%;
    height: 2.5rem;
    ${flex};
    ${justiCenter};
    ${alignItemCenter};
    border-radius: 4px;
  }

  & .important {
    color: var(--sale);
    font-weight: bold;
  }

  & .credit {
    color: var(--ai-purple-50-main);
    font-weight: bold;
  }

  & .imgWrapp {
    margin: 1.5rem 0;
    ${flex};
    ${justiCenter};
  }
`;

const CloseButton = styled.button`
  background-color: var(--gray-gray-20);
`;

const LeftButton = styled.button`
  color: #fff;
  margin-bottom: 0.5rem;
  background: linear-gradient(to left, #a86cea, var(--ai-purple-50-main));
`;

const ErrorModal = (props: IErrorModalProps) => {
  const ButtonContainer = (): React.ReactElement => {
    if (props.isTwoButton) {
      const { leftButtonName, leftButtonOnClick, rightButtonName, rightButtonOnClick } = props;
      return (
        <>
          <LeftButton onClick={leftButtonOnClick}>{leftButtonName}</LeftButton>
          <CloseButton className="second_btn" data-testid="second_btn" onClick={rightButtonOnClick}>
            {rightButtonName}
          </CloseButton>
        </>
      );
    }

    const { buttonName, buttonOnClick } = props;
    return <CloseButton onClick={buttonOnClick}>{buttonName}</CloseButton>;
  };
  return (
    <ErrorModalWrapper>
      <h1>{props.title}</h1>
      {props.children}
      <ButtonContainer />
    </ErrorModalWrapper>
  );
};

export default ErrorModal;
