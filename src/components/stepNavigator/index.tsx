import * as React from 'react';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepIcon from '@mui/material/StepIcon';

import { ReactComponent as CircleArrowLeftIcon } from '../../img/light/circle_arrow_left.svg';
import { ReactComponent as CircleArrowRightIcon } from '../../img/light/circle_arrow_right.svg';

import * as S from './style';

interface StepNavigatorProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  steps: { label: React.ReactNode; children: React.ReactNode }[];
}

export default function StepNavigator({ activeStep, setActiveStep, steps }: StepNavigatorProps) {
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const CustomStepIcon = (props: any) => {
    const { active, completed, className } = props;
    if (completed) {
      return <CircleArrowLeftIcon className={className} width={22} height={22} />;
    } else if (active) {
      return <StepIcon {...props} />;
    } else {
      return <CircleArrowRightIcon className={className} />;
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
            <Step key={index} {...stepProps}>
              <S.Label StepIconComponent={CustomStepIcon} />
            </Step>
          );
        })}
      </S.Step>
      <React.Fragment>
        {steps[activeStep].label}
        <S.Container>{steps[activeStep].children}</S.Container>
      </React.Fragment>
    </S.StepWrap>
  );
}
