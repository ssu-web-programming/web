import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepIcon from '@mui/material/StepIcon';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ArrowDarkIcon } from '../../img/dark/ico_arrow_down_normal.svg';
import { ReactComponent as ArrowLightIcon } from '../../img/light/ico_arrow_down_normal.svg';
import { lang } from '../../locale';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppSelector } from '../../store/store';

import * as S from './style';

interface StepNavigatorProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  steps: { label: React.ReactNode; children: React.ReactNode }[];
}

export default function StepNavigator({ activeStep, setActiveStep, steps }: StepNavigatorProps) {
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const selectedStepRef = useRef<HTMLDivElement>(null);
  const [selectedStepWidth, setSelectedStepWidth] = useState<number>(0);

  useEffect(() => {
    if (selectedStepRef.current) {
      setSelectedStepWidth(selectedStepRef.current.offsetWidth);
    }
  }, []);

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
      return isLightMode ? (
        <ArrowLightIcon className={className} width={22} height={22} />
      ) : (
        <ArrowDarkIcon className={className} width={22} height={22} />
      );
    } else if (active) {
      return <StepIcon {...props} />;
    } else {
      return isLightMode ? (
        <ArrowLightIcon className={className} width={22} height={22} />
      ) : (
        <ArrowDarkIcon className={className} width={22} height={22} />
      );
    }
  };

  return (
    <S.StepWrap>
      <S.Step
        activeStep={activeStep}
        connector={<S.StepLine />}
        isStared={activeStep === 0}
        isFinished={activeStep === steps.length - 1}
        width={selectedStepWidth}
        isWide={lang != 'ko'}>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step
              key={index}
              {...stepProps}
              onClick={() => handleMove(index)}
              ref={activeStep === index ? selectedStepRef : null}>
              <S.Label StepIconComponent={CustomStepIcon}>
                {activeStep === index
                  ? step.label
                  : index < activeStep
                    ? t('Nova.aiVideo.button.prev')
                    : t('Nova.aiVideo.button.next')}
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
