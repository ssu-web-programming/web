import React from 'react';

import * as S from './style';

interface StepperProps {
  currentStep: number;
  steps: {
    label: string;
  }[];
}

function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <S.StepperContainer>
      <S.StepIconsContainer>
        {steps.map((step, index) => {
          return (
            <React.Fragment key={index}>
              {index > 0 && <S.StepConnector />}
              <S.StepItem>
                <S.StepIconWrapper>
                  <S.StepIcon selected={currentStep === index}>
                    <S.StepNumber selected={currentStep === index}>{index + 1}</S.StepNumber>
                  </S.StepIcon>
                </S.StepIconWrapper>
                <S.StepLabel selected={currentStep === index}>{step.label}</S.StepLabel>
              </S.StepItem>
            </React.Fragment>
          );
        })}
      </S.StepIconsContainer>
    </S.StepperContainer>
  );
}

export default Stepper;
