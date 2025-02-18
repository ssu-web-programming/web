import * as React from 'react';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepIcon from '@mui/material/StepIcon';

import { ReactComponent as ArrowLightIcon } from '../../img/light/ico_arrow_down_normal.svg';

import * as S from './style';

interface StepNavigatorProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  steps: { label: React.ReactNode; children: React.ReactNode }[];
}

export default function StepNavigator({ activeStep, setActiveStep, steps }: StepNavigatorProps) {
  const handleMove = (index: number) => {
    if (index === activeStep) {
      return;
    } else if (index < activeStep) {
      setActiveStep(activeStep - 1);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const CustomStepIcon = (props: any) => {
    const { active, completed, className } = props;
    if (completed) {
      return <ArrowLightIcon className={className} width={22} height={22} />;
    } else if (active) {
      return <StepIcon {...props} />;
    } else {
      return <ArrowLightIcon className={className} />;
    }
  };

  return (
    <S.StepWrap>
      <S.Step
        activeStep={activeStep}
        connector={<S.StepLine />}
        isStared={activeStep === 0}
        isFinished={activeStep === steps.length - 1}>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={index} {...stepProps} onClick={() => handleMove(index)}>
              <S.Label StepIconComponent={CustomStepIcon}>
                {activeStep === index ? step.label : index < activeStep ? '이전' : '다음'}
              </S.Label>
            </Step>
          );
        })}
      </S.Step>
      <React.Fragment>
        <S.Container>{steps[activeStep].children}</S.Container>
      </React.Fragment>
    </S.StepWrap>
  );
}
